#!/usr/bin/env python3
"""Certify EN + ES blog corpus at 100/100 platinum. Writes content/autopilot/platinum_certification_report.json"""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from blog_quality import score_post  # noqa: E402

REPORT_PATH = ROOT / "content/autopilot/platinum_certification_report.json"


def audit_dir(directory: Path, label: str) -> dict:
    reports = [score_post(p.stem, p.read_text(encoding="utf-8")) for p in sorted(directory.glob("*.md"))]
    perfect = [r for r in reports if r.score == 100 and not r.issues and r.tier == "platinum"]
    failing = [r for r in reports if r.score < 100 or r.issues or r.tier != "platinum"]
    under3k = [r for r in reports if r.word_count < 3000]
    return {
        "label": label,
        "total": len(reports),
        "perfect100": len(perfect),
        "failing": len(failing),
        "under3000Words": len(under3k),
        "avgScore": round(sum(r.score for r in reports) / max(len(reports), 1), 2),
        "failures": [
            {"slug": r.slug, "score": r.score, "tier": r.tier, "words": r.word_count, "issues": r.issues}
            for r in sorted(failing, key=lambda x: x.score)[:30]
        ],
    }


def main() -> int:
    print("Re-running platinum materializers (EN + ES)...")
    subprocess.run(["npx", "tsx", "scripts/materialize-blog-platinum.ts"], cwd=ROOT, check=False)
    subprocess.run(["npx", "tsx", "scripts/materialize-blog-platinum-es.ts"], cwd=ROOT, check=False)

    en = audit_dir(ROOT / "content/blog", "EN")
    es = audit_dir(ROOT / "content/blog/es", "ES")

    report = {
        "certifiedAt": datetime.now(timezone.utc).isoformat(),
        "standard": "platinum 100/100 (score=100, tier=platinum, ≥3000 words, zero issues)",
        "en": en,
        "es": es,
        "corpusPerfect": en["failing"] == 0 and es["failing"] == 0,
        "totalPerfect": en["perfect100"] + es["perfect100"],
        "totalPosts": en["total"] + es["total"],
    }
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(json.dumps(report, indent=2))
    return 0 if report["corpusPerfect"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
