#!/usr/bin/env python3
"""
Catch up missed daily blog targets (no human required once scheduled).

Computes gap from blog_generation.log + frontmatter dates, then runs autopilot batches.
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from collections import Counter
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from autopilot_site_config import apply_site_env, resolve_site

ROOT = Path(__file__).resolve().parents[1]


def _parse_log_daily(log_path: Path) -> Counter:
    counts: Counter = Counter()
    if not log_path.exists():
        return counts
    for line in log_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        m = re.match(r"\[(\d{4}-\d{2}-\d{2})", line)
        if m and "Published " in line and "/content/blog/" in line and "/es/" not in line:
            counts[m.group(1)] += 1
    return counts


def missed_days(
    daily_target: int,
    *,
    since: date,
    until: date,
    log_path: Path,
) -> list[tuple[str, int]]:
    published = _parse_log_daily(log_path)
    gaps: list[tuple[str, int]] = []
    d = since
    while d <= until:
        ds = d.isoformat()
        got = published.get(ds, 0)
        short = max(0, daily_target - got)
        if short > 0:
            gaps.append((ds, short))
        d += timedelta(days=1)
    return gaps


def main() -> int:
    p = argparse.ArgumentParser(description="Catch up missed autopilot blog days")
    p.add_argument("--site", default="wreckmatch")
    p.add_argument("--days-back", type=int, default=14, help="Look back N days from today (UTC)")
    p.add_argument("--daily-target", type=int, default=0, help="Override daily EN post target")
    p.add_argument("--max-posts", type=int, default=0, help="Cap total posts this run")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    site = resolve_site(args.site)
    apply_site_env(site)
    daily = args.daily_target or int(site.get("dailyTargetEn", 12))
    cap = args.max_posts or int(site.get("catchupMaxPerRun", 36))
    log_path = Path(site["logPath"])

    today = datetime.now(timezone.utc).date()
    since = today - timedelta(days=args.days_back)
    gaps = missed_days(daily, since=since, until=today, log_path=log_path)
    total_short = sum(n for _, n in gaps)

    print(f"Site: {site['id']} | daily target: {daily} EN | cap this run: {cap}")
    print(f"Period: {since.isoformat()} → {today.isoformat()}")
    for day, short in gaps:
        print(f"  {day}: short {short} posts")
    print(f"Total shortfall: {total_short}")

    to_publish = min(total_short, cap)
    if to_publish < 1:
        print("Nothing to catch up.")
        return 0
    if args.dry_run:
        print(f"[dry-run] Would publish {to_publish} EN posts")
        return 0

    script = ROOT / "scripts/wreckmatch_blog_autopilot.py"
    cmd = [
        sys.executable,
        str(script),
        "--batch",
        str(to_publish),
        "--syndicate",
        "--delay",
        "3",
        "--min-score",
        str(site.get("minScore", 98)),
        "--min-words",
        str(site.get("minWords", 3000)),
        "--site",
        site["id"],
    ]
    if not site.get("templateFirst", True):
        cmd.extend(["--ai", "--claude-first"])

    print(f"Running: {' '.join(cmd)}")
    r = subprocess.run(cmd, cwd=str(ROOT))
    return r.returncode


if __name__ == "__main__":
    raise SystemExit(main())
