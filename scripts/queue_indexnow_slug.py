#!/usr/bin/env python3
"""Append blog slug(s) to IndexNow pending queue (picked up by exposure_crush / Vercel cron)."""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PENDING = ROOT / "content/autopilot/indexnow_pending.json"


def main() -> int:
    slugs = [s.strip() for s in sys.argv[1:] if s.strip()]
    if not slugs:
        print("Usage: queue_indexnow_slug.py slug1 slug2 ...")
        return 1
    data = {"slugs": [], "updatedAt": ""}
    if PENDING.exists():
        try:
            data = json.loads(PENDING.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    merged = list(dict.fromkeys([*(data.get("slugs") or []), *slugs]))
    data["slugs"] = merged
    data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    PENDING.parent.mkdir(parents=True, exist_ok=True)
    PENDING.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Queued {len(slugs)} slug(s); total pending: {len(merged)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
