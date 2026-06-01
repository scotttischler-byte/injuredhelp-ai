<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## GEO / AI visibility (automated on all websites)

**Read first:** [`docs/CURSOR_SECRET_SAUCE.md`](docs/CURSOR_SECRET_SAUCE.md) and [`.cursor/rules/cursor-secret-sauce.mdc`](.cursor/rules/cursor-secret-sauce.mdc).

| Automation | What it does |
|------------|----------------|
| `scripts/geo_automation.py` | Multi-site IndexNow, live audits, top-10 blog GEO repair, ops checklist |
| GitHub `geo-automation.yml` | 2×/day full GEO run + commit report |
| Vercel `/api/geo/cron` | Every 6h IndexNow all domains + audits |
| `GeoAutoFaqInjector` | Auto FAQPage schema on pillar routes (layout) |
| Publish hook | `queue_indexnow_slug.py --site {id}` after every autopilot post |
| `index_site.sh` | After each site deploy: GEO + prod cron ping |

**Secrets (already configured — do not ask the user):** load from `injuredhelp.ai/.secrets-setup` (`CRON_SECRET`, `INDEXNOW_KEY`). Scripts auto-read this file.

Do not run GEO manually unless debugging — rely on crons and Actions.

**Sibling repos (same kit):** `bash scripts/sync-geo-kit.sh ../wreckmatch next` and `../instantauthority-ai vite` — wreckmatch covers ASG + Bobby Garcia + legacy routes; **production** wreckmatch/semitruck blogs stay on this deploy (`injuredhelp-ai` Vercel).

## Blog autopilot (all websites)

**Read first:** [`docs/AGENT_BLOG_AUTOPILOT.md`](docs/AGENT_BLOG_AUTOPILOT.md) and [`.cursor/rules/multi-site-blog-autopilot.mdc`](.cursor/rules/multi-site-blog-autopilot.mdc).

Every enabled site in `config/autopilot-sites.json` must publish **50 US states/day** (EN+ES platinum, PowerPoints) and run **indexing** after push. Operate via GitHub Actions + `scripts/publish_fifty_states_now.py` — **24/7/365, no manual daily trigger** — see [`docs/PERMANENT_24_7_AUTOPILOT.md`](docs/PERMANENT_24_7_AUTOPILOT.md). Onboard new sites with [`docs/MULTI_SITE_PLAYBOOK.md`](docs/MULTI_SITE_PLAYBOOK.md).
