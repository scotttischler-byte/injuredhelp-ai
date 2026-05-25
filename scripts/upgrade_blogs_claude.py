#!/usr/bin/env python3
"""
Rewrite lowest-scoring autopilot posts with Claude (gold tier).
Usage:
  ANTHROPIC_API_KEY=... python3 scripts/upgrade_blogs_claude.py --limit 5 --min-score 85
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
BLOG_DIR = ROOT / "content/blog"

from blog_quality import score_post  # noqa: E402

# Reuse autopilot generators
sys.path.insert(0, str(ROOT / "scripts"))
from wreckmatch_blog_autopilot import (  # noqa: E402
    ai_system_prompt,
    append_seo_footer,
    call_claude_api,
    slugify,
)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=5)
    p.add_argument("--min-score", type=int, default=85)
    args = p.parse_args()

    if not os.getenv("ANTHROPIC_API_KEY", "").strip():
        print("ANTHROPIC_API_KEY required")
        return 1

    candidates = []
    for path in sorted(BLOG_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        r = score_post(path.stem, text)
        if r.score < args.min_score and "autopilot: true" in text:
            candidates.append((r.score, path))

    candidates.sort(key=lambda x: x[0])
    upgraded = 0
    for score, path in candidates[: args.limit]:
        slug = path.stem
        title_m = None
        for line in path.read_text().splitlines():
            if line.startswith("title:"):
                title_m = line.split(":", 1)[1].strip().strip('"')
                break
        title = title_m or slug.replace("-", " ").title()
        user = f"""Rewrite this entire blog post to gold quality (1100+ words).
Slug: {slug}
Title: {title}
Keep the same topic and URL slug. Output complete markdown with YAML frontmatter.
qualityTier: gold in frontmatter.
"""
        body = call_claude_api(ai_system_prompt(), user, max_tokens=4000)
        if not body or not body.startswith("---"):
            print(f"skip {slug} (API failed)")
            continue
        topic = {"title": title, "city": "", "state": "", "slug": slug}
        body = append_seo_footer(topic, body)
        new_score = score_post(slug, body).score
        path.write_text(body, encoding="utf-8")
        print(f"upgraded {slug}: {score} -> {new_score}")
        upgraded += 1

    print(f"Done. Upgraded {upgraded} posts.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
