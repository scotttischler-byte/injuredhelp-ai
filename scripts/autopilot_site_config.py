#!/usr/bin/env python3
"""Load multi-site autopilot config (beta: wreckmatch; future: per-client paths/repos)."""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "config/autopilot-sites.json"


def load_config() -> dict[str, Any]:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"Missing {CONFIG_PATH}")
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def resolve_site(site_id: str | None = None) -> dict[str, Any]:
    cfg = load_config()
    sid = (site_id or os.getenv("AUTOPILOT_SITE_ID", "wreckmatch")).strip()
    defaults = cfg.get("defaults", {})
    for site in cfg.get("sites", []):
        if site.get("id") == sid:
            if not site.get("enabled", True):
                raise ValueError(f"Site {sid} is disabled in autopilot-sites.json")
            merged = {**defaults, **site}
            merged["id"] = sid
            merged["root"] = str(ROOT)
            for key in ("blogDir", "blogEsDir", "queuePath", "logPath", "heartbeatPath"):
                if key in merged and merged[key]:
                    merged[key] = str((ROOT / merged[key]).resolve())
            return merged
    raise KeyError(f"Unknown autopilot site: {sid}")


def apply_site_env(site: dict[str, Any]) -> None:
    os.environ["AUTOPILOT_SITE_ID"] = site["id"]
    os.environ["WRECKMATCH_SITE"] = site.get("siteUrl", "https://www.wreckmatch.com")
    os.environ["AUTOPILOT_BLOG_DIR"] = site["blogDir"]
    os.environ["AUTOPILOT_QUEUE_PATH"] = site["queuePath"]
    os.environ["AUTOPILOT_LOG_PATH"] = site.get("logPath", "")
