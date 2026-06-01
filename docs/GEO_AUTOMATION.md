# GEO automation (hands-off)

All properties in `config/geo-sites.json` are covered without manual steps.

**Other repos:** `bash scripts/sync-geo-kit.sh /path/to/repo [next|vite]` copies docs, scripts, playbook, and `.secrets-setup` to wreckmatch, instantauthority-ai, etc.

## What runs automatically

1. **On every blog publish** (`wreckmatch_blog_autopilot.py`): queues slug in the correct `indexnow_pending.json` per site.
2. **Vercel crons** (after deploy): `/api/geo/cron` (6h), `/api/indexing/cron` (4h), `/api/exposure/cron` (12h).
3. **GitHub Actions** `geo-automation.yml` (03:20 & 15:20 UTC): full `geo_automation.py` + report commit.
4. **Exposure crush** (07:00 UTC): repair top blogs + AI citation monitor.
5. **Autopilot hourly**: per-site `--repair-blogs` + `index_site.sh` → production cron.
6. **Layout** `GeoAutoFaqInjector`: FAQPage JSON-LD on pillar pages missing hub FAQs.

## Manual override (debug only)

```bash
python3 scripts/geo_automation.py --repair-blogs --notify-all-prod
python3 scripts/geo_automation.py --site semitruckmatch --index-only
node scripts/geo-audit-url.mjs https://www.wreckmatch.com/blog/your-slug
```

## Reports

- `content/autopilot/geo_automation_report.json` — latest audit + IndexNow results
- Playbook UI: `https://www.wreckmatch.com/secret-sauce.html`

## Ops tasks (logged, not code)

GBP Q&A, Wikidata entity, and competitor screenshots are listed in each report under `opsChecklist`.
