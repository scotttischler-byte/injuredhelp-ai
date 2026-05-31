# Fifty states autopilot (permanent — no Cursor chat required)

## What runs automatically

**Top city in each of 50 US states, every UTC calendar day:**

- English + Spanish platinum guides (≥3,000 words, score 100)
- Scott Tischler or Kathy Carr author + photo
- Hon. Ret. Judge Roy Waddell legal-context review
- EN + ES PowerPoint decks
- IndexNow + internal backlinks

## GitHub Actions (primary engine)

| Workflow | Schedule (UTC) | What it does |
|----------|----------------|--------------|
| **`fifty-states-daily.yml`** | **00:10** | Full sprint (up to 15×5 states) |
| | **03:10, 06:10, 09:10, 12:10, 15:10, 18:10, 21:10** | Pulse (up to 3×5 states) |
| | **23:50** | **Fails if &lt; 50 states** (visible red ❌) |
| **`autopilot-hourly.yml`** | **:05 every hour** | Top-up 3 states if behind |
| **`wreckmatch-traffic-machine.yml`** | Every 30 min | Indexing + PPT/cover backfill |

**You do not need to message Cursor.** Publishing is git push → Vercel deploy.

## Vercel failsafe

Cron hits `/api/automation/blog` every 2 hours → dispatches `fifty-states-daily.yml` if GitHub schedule stalls.

Requires `GITHUB_AUTOPILOT_TOKEN` on Vercel (PAT with `actions:write`).

## Progress file

`content/autopilot/fifty_states_status.json` — updated each sprint round.

## Manual override (optional)

```bash
npm run publish:fifty-states
# or full sprint:
.venv/bin/python scripts/publish_fifty_states_now.py --batch-size 5 --max-rounds 15
```

## Enable once on GitHub

Repo → **Actions** → enable workflows if disabled. Scheduled runs need an active default branch (`main`).

## Copy to another website

See **[MULTI_SITE_PLAYBOOK.md](./MULTI_SITE_PLAYBOOK.md)** — full handoff for a new project tab (Option A monorepo vs Option B new repo, files, commands, Cursor prompt).
