#!/usr/bin/env python3
"""
10x exposure automation — run after blog publish or on schedule.

1. IndexNow (pillars + recent EN/ES + pending slugs)
2. AI citation monitor (checklist or live Perplexity)
3. Writes content/autopilot/exposure_report.json

Usage:
  python3 scripts/exposure_crush.py
  python3 scripts/exposure_crush.py --index-only
  python3 scripts/exposure_crush.py --slugs my-new-post another-post
  PERPLEXITY_API_KEY=... python3 scripts/exposure_crush.py --live-ai
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT_PATH = ROOT / "content/autopilot/exposure_report.json"
SECRETS_FILE = ROOT / ".secrets-setup"


def load_local_secrets() -> None:
    if not SECRETS_FILE.exists():
        return
    for line in SECRETS_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key, val = key.strip(), val.strip().strip('"').strip("'")
        if key and val and not os.getenv(key):
            os.environ[key] = val
    os.environ.setdefault("INDEXNOW_KEY", "065536e9ab94b89a3451fd0f5ea4a193")
PENDING_PATH = ROOT / "content/autopilot/indexnow_pending.json"
BLOG_EN = ROOT / "content/blog"
BLOG_ES = ROOT / "content/blog/es"


def log(msg: str) -> None:
    print(msg, flush=True)


def count_posts() -> dict:
    en = list(BLOG_EN.glob("*.md")) if BLOG_EN.is_dir() else []
    es = list(BLOG_ES.glob("*.md")) if BLOG_ES.is_dir() else []
    platinum = 0
    for p in en:
        try:
            if "platinum" in p.read_text(encoding="utf-8")[:800].lower():
                platinum += 1
        except OSError:
            pass
    return {
        "enPosts": len(en),
        "esPosts": len(es),
        "platinumEn": platinum,
        "lastUpdated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    }


def load_pending() -> list[str]:
    if not PENDING_PATH.exists():
        return []
    try:
        data = json.loads(PENDING_PATH.read_text(encoding="utf-8"))
        return list(data.get("slugs") or [])
    except json.JSONDecodeError:
        return []


def clear_pending() -> None:
    PENDING_PATH.parent.mkdir(parents=True, exist_ok=True)
    PENDING_PATH.write_text(
        json.dumps({"slugs": [], "updatedAt": datetime.now(timezone.utc).isoformat()}, indent=2),
        encoding="utf-8",
    )


def run_indexnow(extra_slugs: list[str], recent: int) -> dict:
    cmd = [
        sys.executable,
        str(ROOT / "scripts/indexing_accelerator.py"),
        "--recent",
        str(recent),
    ]
    if extra_slugs:
        cmd.extend(["--new-slugs", *extra_slugs])
    pending = load_pending()
    all_slugs = list(dict.fromkeys([*extra_slugs, *pending]))
    if all_slugs:
        cmd = [
            sys.executable,
            str(ROOT / "scripts/indexing_accelerator.py"),
            "--recent",
            str(recent),
            "--new-slugs",
            *all_slugs,
        ]
    log(f"IndexNow: {len(all_slugs)} pending/extra slugs, recent={recent}")
    proc = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True)
    if proc.stdout:
        log(proc.stdout[-2000:])
    if proc.returncode != 0 and proc.stderr:
        log(proc.stderr[-1000:])
    return {
        "ok": proc.returncode == 0,
        "returncode": proc.returncode,
        "extraSlugs": all_slugs,
    }


def run_ai_monitor(live: bool, limit: int) -> dict:
    cmd = ["node", str(ROOT / "scripts/ai-citation-monitor.mjs"), "--limit", str(limit)]
    if live:
        cmd.append("--live")
    proc = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True)
    report_file = ROOT / "content/autopilot/ai_citation_report.json"
    summary: dict = {"ok": proc.returncode == 0, "live": live}
    if report_file.exists():
        try:
            data = json.loads(report_file.read_text(encoding="utf-8"))
            summary["wreckmatchHitRate"] = data.get("wreckmatchHitRate")
            summary["totalPrompts"] = data.get("totalPrompts")
        except json.JSONDecodeError:
            pass
    if proc.stdout:
        log(proc.stdout[-1500:])
    return summary


def notify_production(slugs: list[str]) -> dict:
    secret = os.getenv("CRON_SECRET", "").strip()
    site = os.getenv("WRECKMATCH_SITE", "https://www.wreckmatch.com").rstrip("/")
    if not secret or not slugs:
        return {"skipped": True, "reason": "no CRON_SECRET or slugs"}
    import urllib.request

    body = json.dumps({"slugs": slugs}).encode()
    req = urllib.request.Request(
        f"{site}/api/indexing/notify",
        data=body,
        headers={
            "Authorization": f"Bearer {secret}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            raw = resp.read().decode()[:800]
        return {"ok": True, "response": raw}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def main() -> int:
    load_local_secrets()
    p = argparse.ArgumentParser(description="WreckMatch 10x exposure crush")
    p.add_argument("--index-only", action="store_true")
    p.add_argument("--skip-index", action="store_true")
    p.add_argument("--slugs", nargs="*", default=[])
    p.add_argument("--recent", type=int, default=320)
    p.add_argument("--live-ai", action="store_true")
    p.add_argument("--ai-limit", type=int, default=25)
    p.add_argument("--notify-prod", action="store_true", help="POST slugs to production /api/indexing/notify")
    args = p.parse_args()

    stats = count_posts()
    report: dict = {
        "at": datetime.now(timezone.utc).isoformat(),
        "stats": stats,
    }

    if not args.skip_index:
        report["indexnow"] = run_indexnow(args.slugs, args.recent)
        if report["indexnow"].get("ok"):
            clear_pending()

    if not args.index_only:
        report["aiCitations"] = run_ai_monitor(args.live_ai, args.ai_limit)

    if args.notify_prod and args.slugs:
        report["productionNotify"] = notify_production(args.slugs)

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
    log(f"Report: {REPORT_PATH}")
    log(json.dumps(report, indent=2))

    ok = report.get("indexnow", {}).get("ok", True) and report.get("aiCitations", {}).get("ok", True)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
