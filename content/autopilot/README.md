# WreckMatch 24/7 Blog Machine

Automated system that publishes **AI-optimized blog posts** to `content/blog/` around the clock.

## How it runs (production)

**GitHub Actions:** `.github/workflows/wreckmatch-blog-24-7.yml`

- Schedule: **every hour** (`17 * * * *` UTC)
- Writes `content/blog/{slug}.md`
- Commits + pushes → **Vercel redeploys** wreckmatch.com

### Required GitHub secret

| Secret | Purpose |
|--------|---------|
| `OPENAI_API_KEY` | Richer AI posts (optional — templates work without it) |

Add at: **GitHub repo → Settings → Secrets → Actions**

### Manual trigger

Actions → **WreckMatch blog autopilot (24/7)** → Run workflow

- `batch`: number of posts (default 1)
- `refill`: add topics to queue (e.g. 200)
- `use_ai`: toggle OpenAI

## Local 24/7 loop

```bash
chmod +x scripts/run_blog_machine_local.sh
# Optional: export OPENAI_API_KEY=sk-...
./scripts/run_blog_machine_local.sh
```

Env vars:

- `BLOG_MACHINE_INTERVAL_SEC` — default 3600 (1 hour)
- `BLOG_MACHINE_BATCH` — posts per cycle (default 1)
- `BLOG_MACHINE_AI` — set to 0 for template-only

## One-off CLI

```bash
pip install -r scripts/autopilot_requirements.txt

# Fill queue with 200 topics (Texas metros × angles + national)
python scripts/wreckmatch_blog_autopilot.py --refill 200

# Publish 1 post (template)
python scripts/wreckmatch_blog_autopilot.py

# Publish 5 posts with OpenAI
python scripts/wreckmatch_blog_autopilot.py --batch 5 --ai

# Preview without writing
python scripts/wreckmatch_blog_autopilot.py --dry-run
```

## Topic coverage

- **11 Texas metros** × 10 angles (Houston, Dallas, …)
- **15 other states** × 6 angles
- **National** rotating guides
- Queue refills automatically when low

## Logs

- `content/autopilot/blog_generation.log`
- `content/autopilot/blog_queue.json` — pending/completed slugs

## AI + search traffic tips

1. Posts link to `/car-accident-help-{city}` hubs and `/#form`
2. `/llms.txt` lists city guides for LLM crawlers
3. Hourly fresh `date` in frontmatter helps recrawl
4. Pair with **AI Visibility Accelerator** for prompt testing

## Cost estimate (OpenAI)

- `gpt-4o-mini` ≈ $0.01–0.03 per post
- **~24 posts/day** ≈ **$0.50–1.50/day** if AI enabled every hour
- Use template-only (`use_ai: false` in workflow) for **$0**
