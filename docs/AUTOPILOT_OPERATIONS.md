# Autopilot operations (multi-site beta)

## Why publishing stopped when you were not in Cursor

| Layer | Runs without you? | Role |
|-------|-------------------|------|
| **Cursor agent (this chat)** | **No** | Only works when you send a message. It does not run on a schedule. |
| **GitHub Actions** (`wreckmatch-traffic-machine.yml`) | **Yes** | Primary blog publisher — every 30 minutes + daily catch-up 08:00 UTC. |
| **Vercel crons** | **Yes** | Social, Reddit, IndexNow, **blog failsafe** (`/api/automation/blog` dispatches GitHub). |

Publishing stopped **May 27–31** because **GitHub scheduled workflows** were the only engine creating posts, and they did not run (inactive repo schedule, missing `CRON_SECRET` on GitHub, workflow failures, or commits never pushed to `main`). The Cursor agent was never wired to run 24/7.

## What we fixed

1. **Template-first publishing** — no LLM API key required on GitHub.
2. **Daily catch-up** — 08:00 UTC runs `autopilot_catchup.py` then 12 posts + `autopilot_daily_improvements.py`.
3. **Vercel failsafe** — cron hits `/api/automation/blog` → dispatches GitHub workflow (needs `GITHUB_AUTOPILOT_TOKEN` on Vercel).
4. **Heartbeat** — `content/autopilot/heartbeat.json` updated every run.
5. **Multi-site config** — `config/autopilot-sites.json` + `client-autopilot-matrix.yml`.

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
# Normal daily batch (12 posts)
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
