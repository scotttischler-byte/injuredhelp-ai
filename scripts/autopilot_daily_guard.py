#!/usr/bin/env python3
"""
Daily publishing SLA — 50 cities × 50 states (UTC calendar day).

Counts unique US states published today, not total post volume.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from autopilot_site_config import apply_site_env, resolve_site
from autopilot_state_utils import states_published_on

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


def record_day(site_id: str, day: str | None = None) -> dict:
    site = resolve_site(site_id)
    day = day or datetime.now(timezone.utc).date().isoformat()
    log_path = Path(site["logPath"])
    states = sorted(states_published_on(day, log_path))
    en = count_en_published_on(day, log_path)
    target_states = int(site.get("dailyTargetStates", 50))
    ledger = load_ledger(ledger_path(site))
    ledger.setdefault("days", {})[day] = {
        "en": en,
        "states": len(states),
        "stateList": states,
        "targetStates": target_states,
        "target": target_states,
        "recordedAt": datetime.now(timezone.utc).isoformat(),
    }
    save_ledger(ledger_path(site), ledger)
    return ledger["days"][day]


def state_deficit(site: dict, day: str) -> int:
    log_path = Path(site["logPath"])
    target = int(site.get("dailyTargetStates", 50))
    have = len(states_published_on(day, log_path))
    return max(0, target - have)


def ensure_today(site_id: str, *, max_batch: int = 0) -> dict:
    site = resolve_site(site_id)
    apply_site_env(site)
    today = datetime.now(timezone.utc).date().isoformat()
    target = int(site.get("dailyTargetStates", 50))
    cap = max_batch or int(site.get("catchupMaxPerRun", 10))

    stats = record_day(site_id, today)
    deficit = state_deficit(site, today)
    published_now = 0

    if deficit > 0:
        batch = min(deficit, cap)
        script = ROOT / "scripts/wreckmatch_blog_autopilot.py"
        env = {
            **__import__("os").environ,
            "AUTOPILOT_SOURCE": "daily-guard",
            "FIFTY_STATES_ONLY": "1",
        }
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
                "--fifty-states-only",
                "--syndicate",
                "--delay",
                "3",
                "--min-score",
                str(site.get("minScore", 100)),
                "--min-words",
                str(site.get("minWords", 3000)),
            ],
            cwd=str(ROOT),
            env=env,
        )
        published_now = batch if r.returncode == 0 else 0
        stats = record_day(site_id, today)
        deficit = state_deficit(site, today)

    states_count = stats.get("states", len(stats.get("stateList", [])))
    return {
        "day": today,
        "targetStates": target,
        "statesPublished": states_count,
        "stateList": stats.get("stateList", []),
        "enPostsToday": stats.get("en", 0),
        "deficit": deficit,
        "publishedThisRun": published_now,
        "ok": states_count >= target,
    }


def verify_day(site_id: str, day: str) -> dict:
    site = resolve_site(site_id)
    target = int(site.get("dailyTargetStates", 50))
    stats = record_day(site_id, day)
    states_count = stats.get("states", 0)
    return {
        "day": day,
        "targetStates": target,
        "statesPublished": states_count,
        "stateList": stats.get("stateList", []),
        "ok": states_count >= target,
    }


def main() -> int:
    p = argparse.ArgumentParser(description="Daily 50-state blog publishing SLA guard")
    p.add_argument("--site", default="wreckmatch")
    p.add_argument("--ensure-today", action="store_true", help="Publish until 50 states met (capped)")
    p.add_argument("--verify-yesterday", action="store_true", help="Fail if yesterday below 50 states")
    p.add_argument("--verify-today", action="store_true", help="Fail if today below 50 states (end-of-day)")
    p.add_argument("--record-only", action="store_true", help="Refresh ledger from log only")
    p.add_argument("--max-batch", type=int, default=0)
    args = p.parse_args()

    if args.record_only:
        stats = record_day(args.site)
        print(json.dumps(stats))
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
                f"::error::SLA MISS: {yesterday} only {result['statesPublished']}/{result['targetStates']} states",
                file=sys.stderr,
            )
            return 1
        return 0

    if args.verify_today:
        result = verify_day(args.site, datetime.now(timezone.utc).date().isoformat())
        print(json.dumps(result, indent=2))
        if not result["ok"]:
            print(
                f"::error::SLA MISS TODAY: {result['statesPublished']}/{result['targetStates']} states",
                file=sys.stderr,
            )
            return 1
        return 0

    p.print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
