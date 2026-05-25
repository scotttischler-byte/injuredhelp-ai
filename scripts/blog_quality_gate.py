#!/usr/bin/env python3
"""Audit all blog posts; exit 1 if any score below threshold (for CI)."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from blog_quality import score_post  # noqa: E402

BLOG_DIR = ROOT / "content/blog"


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--min-score", type=int, default=95)
    p.add_argument("--json", action="store_true")
    p.add_argument("--limit", type=int, default=0)
    args = p.parse_args()

    reports = []
    for path in sorted(BLOG_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        reports.append(score_post(path.stem, text))

    reports.sort(key=lambda r: r.score)
    failing = [r for r in reports if r.score < args.min_score]

    if args.json:
        out = reports[: args.limit] if args.limit else reports
        print(
            json.dumps(
                [
                    {
                        "slug": r.slug,
                        "score": r.score,
                        "tier": r.tier,
                        "words": r.word_count,
                        "issues": r.issues,
                    }
                    for r in out
                ],
                indent=2,
            )
        )
    else:
        print(f"Audited {len(reports)} posts. Failing (<{args.min_score}): {len(failing)}")
        show = failing[: args.limit] if args.limit else failing[:25]
        for r in show:
            print(f"  {r.score:3d}  {r.slug}  {', '.join(r.issues)}")
        avg = sum(r.score for r in reports) / max(len(reports), 1)
        print(f"Average score: {avg:.1f}")
        gold = sum(1 for r in reports if r.tier == "gold")
        print(f"Gold tier (score ≥95, 900+ words): {gold}")

    return 1 if failing else 0


if __name__ == "__main__":
    raise SystemExit(main())
