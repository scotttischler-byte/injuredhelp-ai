# 10x exposure automation — WreckMatch

Fully automated stack for **Google/Bing indexing**, **AI citation** (`llms.txt`), and **post-publish pings**.

## What runs automatically

| Trigger | Action |
|---------|--------|
| **Every 30 min** (traffic machine) | 3 platinum posts → queue IndexNow → `exposure_crush.py` |
| **Every 4 h** (Vercel) | `/api/indexing/cron` — IndexNow 200 EN + 100 ES |
| **6:00 & 18:00 UTC** (Vercel) | `/api/exposure/cron` — full 320 EN + 320 ES + pillars |
| **Daily 7:00 UTC** (GitHub) | `exposure-crush.yml` — IndexNow + AI citation report |
| **Every request** | `/llms.txt` — dynamic stats + 24 latest platinum URLs |

## Secrets (already configured)

Your stack uses **`.secrets-setup`** locally (same values as Vercel Production):

- `CRON_SECRET` — already on Vercel; health check returns `cronSecret: true`
- `INDEXNOW_KEY` — live at `https://www.wreckmatch.com/065536e9ab94b89a3451fd0f5ea4a193.txt`

GitHub Actions should use the **same** `CRON_SECRET` as Vercel (see `docs/GITHUB_SECRETS_ONE_TIME.md`). No need to regenerate.

## Manual commands

```bash
npm run blog:today          # 12 platinum posts + syndication + exposure crush
npm run exposure:crush      # IndexNow + citation checklist
npm run exposure:index      # IndexNow only (320 recent)
npm run monitor:ai-citations:live   # Perplexity (needs API key)
```

## Reports

- `content/autopilot/exposure_report.json` — daily crush summary
- `content/autopilot/ai_citation_report.json` — citation hit rate
- `content/autopilot/indexing_log.jsonl` — IndexNow history
- `content/autopilot/indexnow_pending.json` — slugs awaiting next cron

## Google Search Console (human once)

1. Verify `www.wreckmatch.com`
2. Submit sitemap: `https://www.wreckmatch.com/sitemap.xml`
3. Weekly: inspect top pillar URLs

IndexNow does **not** replace GSC — use both.
