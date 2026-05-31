# Autopilot operations (multi-site beta)

> **50 states:** See [FIFTY_STATES_AUTOPILOT.md](./FIFTY_STATES_AUTOPILOT.md) — permanent schedule, no manual prompting.  
> **New client / new tab:** See [MULTI_SITE_PLAYBOOK.md](./MULTI_SITE_PLAYBOOK.md) — copy the full model without starting over.

## Daily SLA (non-negotiable)

| Rule | Value |
|------|--------|
| **Minimum** | **50 English** platinum posts **every calendar day (UTC)** |
| **Geo** | **50 cities × 50 states** — one rotating city per state injected at queue front each day |
| **Quality** | **Platinum 100/100**, **≥3,000 words**, **EN then ES**, **PowerPoint EN + ES** (required), IndexNow |
| **Authors** | **Scott Tischler** or **Kathy Carr** (photo bylines) — topic-based rotation |
| **Reviewer** | **Hon. Ret. Judge Roy Waddell** — legal-context review on every guide |
| **Backlinks** | `organic_crush.py` internal mesh + viral packs after each publish batch |
| **24/7** | `autopilot-hourly.yml` every hour + traffic machine every 30 min (index/mesh) |
| **Workflow** | **`fifty-states-daily.yml`** — full sprint **00:10 UTC**, pulse **every 3h**, gate **23:50** |
| **Hourly** | `autopilot-hourly.yml` — 3 states/hour if behind |
| **Indexing** | `wreckmatch-traffic-machine.yml` every 30 min |
| **Failure** | GitHub shows red ❌ if a day ends under **50 states** |

**Everyday means everyday.** Catch-up is capped at **10 posts/run** (no mega-batches).

```bash
npm run autopilot:daily   # local: publish today's deficit
```

Ledger: `content/autopilot/daily_publish_ledger.json`

---

## Why publishing stopped when you were not in Cursor

| Layer | Runs without you? | Role |
|-------|-------------------|------|
| **Cursor agent (this chat)** | **No** | Only works when you send a message. It does not run on a schedule. |
| **GitHub Actions** (`daily-blog-mandatory.yml`) | **Yes** | Primary publisher — 50 EN/day in 5 runs. Traffic machine = indexing only on schedule. |
| **Vercel crons** | **Yes** | Social, Reddit, IndexNow, **blog failsafe** (`/api/automation/blog` dispatches GitHub). |

Publishing stopped **May 27–31** because **GitHub scheduled workflows** were the only engine creating posts, and they did not run (inactive repo schedule, missing `CRON_SECRET` on GitHub, workflow failures, or commits never pushed to `main`). The Cursor agent was never wired to run 24/7.

## What we fixed

1. **Template-first publishing** — no LLM API key required on GitHub.
2. **50-state rotation** — `inject_daily_fifty_states()` prepends one city topic per US state daily.
3. **Morning catch-up** — 08:00 UTC traffic run tops up deficit (max 10) + `autopilot_daily_improvements.py`.
4. **Vercel failsafe** — cron hits `/api/automation/blog` → dispatches `daily-blog-mandatory.yml` (needs `GITHUB_AUTOPILOT_TOKEN` on Vercel).
5. **Heartbeat** — `content/autopilot/heartbeat.json` updated every run.
6. **Multi-site config** — `config/autopilot-sites.json` + `client-autopilot-matrix.yml`.

## Multi-site (clients)

Add a site block in `config/autopilot-sites.json`:

```json
{
  "id": "client-slug",
  "enabled": true,
  "siteUrl": "https://client.com",
  "contentRoot": "sites/client-slug/content",
  "blogDir": "sites/client-slug/content/blog",
  "blogEsDir": "sites/client-slug/content/blog/es",
  "queuePath": "sites/client-slug/content/autopilot/blog_queue.json",
  "logPath": "sites/client-slug/content/autopilot/blog_generation.log",
  "heartbeatPath": "sites/client-slug/content/autopilot/heartbeat.json"
}
```

For a **separate repo**, point `github.owner` / `github.repo` and run the same workflows there.

## Required secrets

| Where | Secret | Purpose |
|-------|--------|---------|
| **Vercel** (production) | `CRON_SECRET` | Cron auth + IndexNow |
| **Vercel** | `GITHUB_AUTOPILOT_TOKEN` | Dispatch blog workflow if GitHub schedule stalls |
| **GitHub** repo | `CRON_SECRET` | Same value — prod IndexNow ping after deploy |
| **GitHub** (optional) | `ANTHROPIC_API_KEY` | Higher-variance AI drafts |

## Commands

```bash
# Normal daily batch (10 posts; run 5× via GitHub or repeat locally)
npm run blog:today

# Catch up missed days (cap 36 per run)
npm run autopilot:catchup

# Daily improvements only (links, viral, exposure)
npm run autopilot:improve

# Multi-site
python scripts/wreckmatch_blog_autopilot.py --batch 6 --site wreckmatch --syndicate
```

## Verify

- GitHub → Actions → **WreckMatch traffic machine** → green runs every ~30 min.
- `content/autopilot/heartbeat.json` → `lastRunAt` within 24h.
- `GET /api/automation/health` with `Authorization: Bearer $CRON_SECRET`.
