#!/usr/bin/env python3
"""
Rewrite posts below A+ bar with Claude (Scott voice, Roy review, gold frontmatter).

Usage:
  source .secrets-setup  # or export ANTHROPIC_API_KEY
  python3 scripts/upgrade_blogs_claude.py --limit 20 --min-score 95
  python3 scripts/upgrade_blogs_claude.py --all --sleep 3
"""
from __future__ import annotations

import argparse
import os
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
BLOG_DIR = ROOT / "content/blog"

from blog_quality import parse_frontmatter, score_post  # noqa: E402

sys.path.insert(0, str(ROOT / "scripts"))
from wreckmatch_blog_autopilot import (  # noqa: E402
    ai_system_prompt,
    append_seo_footer,
    call_claude_api,
)

# Reuse slug parser from fix script
sys.path.insert(0, str(ROOT / "scripts"))
from blog_authors import author_display, author_id_for_slug  # noqa: E402
from fix_blog_posts import slug_city_state  # noqa: E402


def needs_upgrade(text: str, min_score: int) -> bool:
    fm, _ = parse_frontmatter(text)
    if fm.get("qualityTier", "").lower() == "gold" and fm.get("authorId") in ("scott-tischler", "kathy-carr"):
        r = score_post("", text)
        if r.score >= min_score and r.word_count >= 2000:
            return False
    r = score_post("", text)
    return r.score < min_score or r.word_count < 2000 or fm.get("qualityTier", "").lower() != "gold"


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=10)
    p.add_argument("--min-score", type=int, default=95)
    p.add_argument("--all", action="store_true", help="Process every post that needs upgrade")
    p.add_argument("--offset", type=int, default=0, help="Skip first N candidates (parallel shards)")
    p.add_argument("--sleep", type=float, default=2.5, help="Seconds between API calls")
    args = p.parse_args()

    if not os.getenv("ANTHROPIC_API_KEY", "").strip():
        print("ANTHROPIC_API_KEY required (add to .secrets-setup or GitHub secrets)")
        return 1

    candidates: list[tuple[int, int, Path]] = []
    for path in sorted(BLOG_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        if "autopilot: true" not in text and not args.all:
            continue
        if not needs_upgrade(text, args.min_score):
            continue
        r = score_post(path.stem, text)
        candidates.append((r.score, -r.word_count, path))

    candidates.sort(key=lambda x: (x[0], x[1]))
    if args.offset:
        candidates = candidates[args.offset :]
    limit = len(candidates) if args.all else args.limit
    upgraded = 0
    skipped = 0

    for score, _neg_wc, path in candidates[:limit]:
        slug = path.stem
        text = path.read_text(encoding="utf-8")
        fm, body = parse_frontmatter(text)
        title = fm.get("title", slug.replace("-", " ").title()).strip('"')
        city, state = slug_city_state(slug)
        author_id = author_id_for_slug(slug)
        author_name = author_display(author_id)
        voice = (
            "Kathy Carr — CEO & Co-Founder. Empathetic, family-focused, calm authority."
            if author_id == "kathy-carr"
            else "Scott Tischler — Co-Founder. Direct, strategic, levels playing field vs insurers."
        )
        author_section = (
            "## A note for families navigating recovery in [city]"
            if author_id == "kathy-carr"
            else "## Why we published this guide for [city]"
        )
        user = f"""Rewrite this entire blog post to A+ gold quality.

Slug (keep unchanged): {slug}
Title: {title}
City: {city or "infer from slug"}
State: {state or fm.get("state", "")}
Author: {author_name} (authorId: {author_id}) — write in this voice: {voice}

Requirements:
- Include section "{author_section}"
- End with Roy Waddell review line (italic)
- 2,000–2,400 words minimum in markdown body (LLM/SEO citation quality)
- Quotable first sentence per major section; table + numbered steps + 4+ FAQs
- YAML frontmatter: qualityTier: gold, authorId: {author_id}, reviewerId: roy-waddell, autopilot: true
- Same topic/URL; correct {state or "state"} statute years only; educational disclaimer + 800+ firms

Current post (improve, do not shorten compliance sections):
---
{body[:14000]}
"""
        body_new = call_claude_api(ai_system_prompt(author_id), user, max_tokens=8192)
        if not body_new or not body_new.startswith("---"):
            print(f"skip {slug} (API failed)")
            skipped += 1
            continue
        topic = {"title": title, "city": city, "state": state, "slug": slug}
        body_new = append_seo_footer(topic, body_new)
        new_score = score_post(slug, body_new)
        if new_score.score < score:
            print(f"skip {slug} (new score {new_score.score} < {score})")
            skipped += 1
            time.sleep(args.sleep)
            continue
        path.write_text(body_new, encoding="utf-8")
        print(f"upgraded {slug}: {score} -> {new_score.score} ({new_score.word_count} words)")
        upgraded += 1
        time.sleep(args.sleep)

    print(f"Done. Upgraded {upgraded}, skipped {skipped}, queue had {len(candidates)}.")
    return 0 if upgraded or not candidates else 0


if __name__ == "__main__":
    raise SystemExit(main())
