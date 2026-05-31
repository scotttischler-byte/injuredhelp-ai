#!/usr/bin/env python3
"""
Daily publishing SLA — every calendar day (UTC) must hit dailyTargetEn posts.

Used by GitHub Actions and Vercel failsafe. Fails loudly if yesterday missed (end-of-day gate).
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from autopilot_site_config import apply_site_env, resolve_site

ROOT = Path(__file__).resolve().parents[1]
LEDGER_NAME = "daily_publish_ledger.json"


def ledger_path(site: dict) -> Path:
    p = Path(site.get("contentRoot", "content")) / "autopilot" / LEDGER_NAME
    if not p.is_absolute():
        p = ROOT / p
    return p.resolve()


def load_ledger(path: Path) -> dict:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return {"version": 1, "days": {}}


def save_ledger(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def count_en_published_on(day: str, log_path: Path) -> int:
    if not log_path.exists():
        return 0
    n = 0
    for line in log_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        if not line.startswith(f"[{day}"):
            continue
        if "Published " in line and "/content/blog/" in line and "/es/" not in line:
            n += 1
    return n


def record_day(site_id: str, day: str | None = None) -> int:
    site = resolve_site(site_id)
    day = day or datetime.now(timezone.utc).date().isoformat()
    log_path = Path(site["logPath"])
    count = count_en_published_on(day, log_path)
    ledger = load_ledger(ledger_path(site))
    ledger.setdefault("days", {})[day] = {
        "en": count,
        "target": int(site.get("dailyTargetEn", 12)),
        "recordedAt": datetime.now(timezone.utc).isoformat(),
    }
    save_ledger(ledger_path(site), ledger)
    return count


def ensure_today(site_id: str, *, max_batch: int = 0) -> dict:
    site = resolve_site(site_id)
    apply_site_env(site)
    today = datetime.now(timezone.utc).date().isoformat()
    target = int(site.get("dailyTargetEn", 12))
    cap = max_batch or int(site.get("catchupMaxPerRun", 12))

    current = record_day(site_id, today)
    deficit = max(0, target - current)
    published_now = 0

    if deficit > 0:
        batch = min(deficit, cap)
        script = ROOT / "scripts/wreckmatch_blog_autopilot.py"
        env = {**__import__("os").environ, "AUTOPILOT_SOURCE": "daily-guard"}
        subprocess.run(
            [sys.executable, str(script), "--inject-daily-states", "--site", site_id],
            cwd=str(ROOT),
            env=env,
            check=False,
        )
        r = subprocess.run(
            [
                sys.executable,
                str(script),
                "--batch",
                str(batch),
                "--site",
                site_id,
                "--syndicate",
                "--delay",
                "3",
                "--min-score",
                str(site.get("minScore", 98)),
                "--min-words",
                str(site.get("minWords", 3000)),
            ],
            cwd=str(ROOT),
            env=env,
        )
        published_now = batch if r.returncode == 0 else 0
        current = record_day(site_id, today)

    return {
        "day": today,
        "target": target,
        "count": current,
        "deficit": max(0, target - current),
        "publishedThisRun": published_now,
        "ok": current >= target,
    }


def verify_day(site_id: str, day: str) -> dict:
    site = resolve_site(site_id)
    target = int(site.get("dailyTargetEn", 12))
    count = record_day(site_id, day)
    return {
        "day": day,
        "target": target,
        "count": count,
        "ok": count >= target,
    }


def main() -> int:
    p = argparse.ArgumentParser(description="Daily blog publishing SLA guard")
    p.add_argument("--site", default="wreckmatch")
    p.add_argument("--ensure-today", action="store_true", help="Publish until today's target met (capped)")
    p.add_argument("--verify-yesterday", action="store_true", help="Fail if yesterday below target")
    p.add_argument("--verify-today", action="store_true", help="Fail if today below target (end-of-day)")
    p.add_argument("--record-only", action="store_true", help="Refresh ledger from log only")
    p.add_argument("--max-batch", type=int, default=0)
    args = p.parse_args()

    if args.record_only:
        n = record_day(args.site)
        print(json.dumps({"recorded": n}))
        return 0

    if args.ensure_today:
        result = ensure_today(args.site, max_batch=args.max_batch)
        print(json.dumps(result, indent=2))
        return 0 if result["ok"] else 1

    if args.verify_yesterday:
        yesterday = (datetime.now(timezone.utc).date() - timedelta(days=1)).isoformat()
        result = verify_day(args.site, yesterday)
        print(json.dumps(result, indent=2))
        if not result["ok"]:
            print(
                f"::error::SLA MISS: {yesterday} published {result['count']}/{result['target']} EN posts",
                file=sys.stderr,
            )
            return 1
        return 0

    if args.verify_today:
        result = verify_day(args.site, datetime.now(timezone.utc).date().isoformat())
        print(json.dumps(result, indent=2))
        if not result["ok"]:
            print(
                f"::error::SLA MISS TODAY: {result['count']}/{result['target']} EN posts — autopilot must run before midnight UTC",
                file=sys.stderr,
            )
            return 1
        return 0

    p.print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
