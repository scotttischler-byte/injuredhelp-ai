# Permanent 24/7/365 blog autopilot

This repo is configured to run **without manual daily triggers**. Publishing is **GitHub Actions + Vercel crons**, not the marketing site deploy alone.

## SLA (every enabled site in `config/autopilot-sites.json`)

| Rule | Value |
|------|--------|
| Calendar | **UTC day**, every day, year-round |
| Coverage | **50 unique US states** (top city per state) |
| Quality | EN score **100**, **≥3,000 words**, ES + EN/ES PowerPoint + cover |
| Sites today | `wreckmatch`, `semitruckmatch` (see config) |

## What runs automatically (no holidays off)

| Layer | Schedule | Role |
|-------|----------|------|
| **Fifty states daily (permanent)** | 00:10 full + 7× pulse + 23:50 verify | Primary publisher |
| **Autopilot hourly pulse** | Every hour `:05` | Top-up up to 3 states/hour |
| **Client autopilot matrix** | Every 6h | Backup fifty-state pulse |
| **WreckMatch traffic machine** | Every 30m + 08:00 UTC | Covers, PPT, IndexNow |
| **Organic / GEO / Exposure** | 4–6h | Indexing + mesh + GEO repair |
| **Vercel** `/api/automation/blog` | Every 2h | Dispatches GitHub if workflows stall |

Only the **23:50 UTC** job is allowed to **fail** the workflow when states &lt; 50. All other runs may publish **partial** progress and still commit (24/7 continuity).

## One-time human checklist

1. **GitHub Actions enabled** on `scotttischler-byte/injuredhelp-ai`.
2. Run **one manual** workflow: `Fifty states daily (permanent)` → `full_sprint=true` (activates scheduled cron).
3. **Secrets** on GitHub + Vercel: `CRON_SECRET`, `GITHUB_AUTOPILOT_TOKEN` (Vercel dispatch), `ANTHROPIC_API_KEY` (optional AI), `INDEXNOW_KEY`.
4. Confirm: `gh run list --workflow="Fifty states daily (permanent)"` shows green pulses through the day; `23:50` verify shows **50/50**.

## Check today’s progress

```bash
PYTHONPATH=scripts python3 scripts/autopilot_daily_guard.py --record-only --site wreckmatch
PYTHONPATH=scripts python3 scripts/autopilot_daily_guard.py --verify-today --site wreckmatch
```

Ledger: `content/autopilot/daily_publish_ledger.json`

## If workflows show red during the day

Intermediate pulses used to exit `1` when states &lt; 50 in one pass — that blocked commits. Fixed: `publish_fifty_states_now.py` exits `0` on partial progress; use `--strict` only for explicit verify.

Stub posts (&lt;3k words) used to block states — fixed: autopilot **re-materializes** existing stubs instead of skipping them.
