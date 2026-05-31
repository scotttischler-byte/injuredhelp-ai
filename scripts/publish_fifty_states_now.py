#!/usr/bin/env python3
"""
Publish top city × 50 states (EN+ES+PPT) until today's state SLA is met.

  python3 scripts/publish_fifty_states_now.py
  python3 scripts/publish_fifty_states_now.py --batch-size 5 --max-rounds 15
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from autopilot_site_config import resolve_site  # noqa: E402
from autopilot_state_utils import load_state_names, states_published_on  # noqa: E402


def venv_python() -> str:
    py = ROOT / ".venv/bin/python"
    if py.exists():
        return str(py)
    subprocess.run([sys.executable, "-m", "venv", str(ROOT / ".venv")], cwd=str(ROOT), check=False)
    pip = ROOT / ".venv/bin/pip"
    req = ROOT / "scripts/autopilot_requirements.txt"
    if pip.exists() and req.exists():
        subprocess.run([str(pip), "install", "-q", "-r", str(req)], cwd=str(ROOT), check=False)
    return str(py) if py.exists() else sys.executable


def main() -> int:
    p = argparse.ArgumentParser(description="Sprint: top 50 cities in 50 states today")
    p.add_argument("--site", default="wreckmatch")
    p.add_argument("--batch-size", type=int, default=5)
    p.add_argument("--max-rounds", type=int, default=12, help="Max publish rounds (batch-size each)")
    args = p.parse_args()

    site = resolve_site(args.site)
    py = venv_python()
    autopilot = ROOT / "scripts/wreckmatch_blog_autopilot.py"
    target = int(site.get("dailyTargetStates", 50))
    log_path = Path(site["logPath"])
    today = datetime.now(timezone.utc).date().isoformat()
    all_states = set(load_state_names())

    print(f"Target: {target} states (top city per state) — UTC day {today}")

    for round_n in range(1, args.max_rounds + 1):
        have = states_published_on(today, log_path)
        need = sorted(all_states - have)[:50]
        deficit = max(0, target - len(have))
        print(f"\nRound {round_n}: {len(have)}/{target} states — need {deficit}")

        if deficit <= 0:
            print("Done — 50-state SLA met.")
            return 0

        batch = min(args.batch_size, deficit)
        env = {
            **__import__("os").environ,
            "AUTOPILOT_SOURCE": "fifty-states-sprint",
            "FIFTY_STATES_ONLY": "1",
            "AUTOPILOT_LOG_PATH": str(log_path),
        }

        subprocess.run(
            [py, str(autopilot), "--inject-daily-states", "--site", args.site],
            cwd=str(ROOT),
            env=env,
            check=False,
        )

        r = subprocess.run(
            [
                py,
                str(autopilot),
                "--batch",
                str(batch),
                "--site",
                args.site,
                "--fifty-states-only",
                "--syndicate",
                "--delay",
                "2",
                "--min-score",
                str(site.get("minScore", 100)),
                "--min-words",
                str(site.get("minWords", 3000)),
            ],
            cwd=str(ROOT),
            env=env,
        )

        have = states_published_on(today, log_path)
        print(f"After round {round_n}: {len(have)} states — {sorted(have)}")
        if r.returncode != 0 and len(have) <= len(states_published_on(today, log_path)):
            print("WARN: batch returned non-zero; continuing if progress was made")

    have = states_published_on(today, log_path)
    print(f"\nFinal: {len(have)}/{target} states")
    return 0 if len(have) >= target else 1


if __name__ == "__main__":
    raise SystemExit(main())
