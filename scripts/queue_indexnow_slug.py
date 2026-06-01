#!/usr/bin/env python3
"""Append blog slug(s) to IndexNow pending queue (per-site path in config/geo-sites.json)."""
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GEO_SITES = ROOT / "config/geo-sites.json"
DEFAULT_PENDING = ROOT / "content/autopilot/indexnow_pending.json"


def pending_for_site(site_id: str) -> Path:
    if GEO_SITES.exists():
        try:
            data = json.loads(GEO_SITES.read_text(encoding="utf-8"))
            for s in data.get("sites", []):
                if s.get("id") == site_id and s.get("pendingPath"):
                    return ROOT / s["pendingPath"]
        except json.JSONDecodeError:
            pass
    if site_id == "semitruckmatch":
        return ROOT / "sites/semitruckmatch/content/autopilot/indexnow_pending.json"
    return DEFAULT_PENDING


def main() -> int:
    p = argparse.ArgumentParser(description="Queue slugs for IndexNow pickup")
    p.add_argument("--site", default="wreckmatch", help="Site id: wreckmatch | semitruckmatch | injuredhelp")
    p.add_argument("slugs", nargs="*", help="Blog slugs to queue")
    args = p.parse_args()
    slugs = [s.strip() for s in args.slugs if s.strip()]
    if not slugs:
        print("Usage: queue_indexnow_slug.py [--site SITE] slug1 slug2 ...")
        return 1

    pending_path = pending_for_site(args.site)
    data = {"slugs": [], "updatedAt": ""}
    if pending_path.exists():
        try:
            data = json.loads(pending_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    merged = list(dict.fromkeys([*(data.get("slugs") or []), *slugs]))
    data["slugs"] = merged
    data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    pending_path.parent.mkdir(parents=True, exist_ok=True)
    pending_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"[{args.site}] Queued {len(slugs)} slug(s) → {pending_path.relative_to(ROOT)} (total {len(merged)})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
