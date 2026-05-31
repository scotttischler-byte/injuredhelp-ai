<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Blog autopilot (all websites)

**Read first:** [`docs/AGENT_BLOG_AUTOPILOT.md`](docs/AGENT_BLOG_AUTOPILOT.md) and [`.cursor/rules/multi-site-blog-autopilot.mdc`](.cursor/rules/multi-site-blog-autopilot.mdc).

Every enabled site in `config/autopilot-sites.json` must publish **50 US states/day** (EN+ES platinum, PowerPoints) and run **indexing** after push. Operate via GitHub Actions + `scripts/publish_fifty_states_now.py` — do not wait for the user to ask. Onboard new sites with [`docs/MULTI_SITE_PLAYBOOK.md`](docs/MULTI_SITE_PLAYBOOK.md).
