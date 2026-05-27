#!/usr/bin/env python3
"""Generate gold-tier .pptx for all blog posts. Usage: .venv/bin/python scripts/generate_blog_presentations.py [--all] [--missing-only]"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from blog_presentation import (  # noqa: E402
    BLOG_DIR,
    generate_for_post,
    score_presentation,
    upsert_frontmatter_presentation,
)

PRESENTATION_URL = "/blog/presentations/{slug}.pptx"


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--all", action="store_true", help="Regenerate every post")
    p.add_argument("--missing-only", action="store_true", help="Only posts without .pptx")
    p.add_argument("--slug", type=str, default="", help="Single slug")
    p.add_argument("--min-score", type=int, default=100)
    args = p.parse_args()

    paths = sorted(BLOG_DIR.glob("*.md"))
    if args.slug:
        paths = [BLOG_DIR / f"{args.slug}.md"]

    ok = 0
    fail = 0
    for path in paths:
        slug = path.stem
        out = ROOT / "public/blog/presentations" / f"{slug}.pptx"
        if args.missing_only and out.exists():
            continue
        force = args.all or bool(args.slug)
        report = generate_for_post(path, force=force)
        url = PRESENTATION_URL.format(slug=slug)
        if report.score >= args.min_score:
            if upsert_frontmatter_presentation(path, url):
                pass
            print(f"OK {slug}: {report.slide_count} slides, score {report.score}")
            ok += 1
        else:
            print(f"FAIL {slug}: score {report.score} {report.issues}")
            fail += 1

    print(f"Done. {ok} passed, {fail} below {args.min_score}.")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
