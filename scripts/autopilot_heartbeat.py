#!/usr/bin/env python3
"""Record autopilot run heartbeat (per site) for health checks and alerting."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from autopilot_site_config import resolve_site


def write_heartbeat(
    site_id: str,
    *,
    published: int,
    batch_requested: int,
    slugs: list[str],
    source: str,
    extra: dict[str, Any] | None = None,
) -> Path:
    site = resolve_site(site_id)
    path = Path(site.get("heartbeatPath", site["root"] + "/content/autopilot/heartbeat.json"))
    path.parent.mkdir(parents=True, exist_ok=True)

    existing: dict[str, Any] = {}
    if path.exists():
        try:
            existing = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            existing = {}

    sites = existing.get("sites", {})
    sites[site_id] = {
        "lastRunAt": datetime.now(timezone.utc).isoformat(),
        "lastPublished": published,
        "batchRequested": batch_requested,
        "slugs": slugs[:20],
        "source": source,
        **(extra or {}),
    }
    payload = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "sites": sites,
    }
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return path


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser()
    p.add_argument("--site", default="wreckmatch")
    p.add_argument("--published", type=int, default=0)
    p.add_argument("--batch", type=int, default=0)
    p.add_argument("--source", default="manual")
    args = p.parse_args()
    out = write_heartbeat(
        args.site,
        published=args.published,
        batch_requested=args.batch,
        slugs=[],
        source=args.source,
    )
    print(out)
