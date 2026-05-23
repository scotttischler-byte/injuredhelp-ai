# WreckMatch Traffic Machine (24/7/365)

Automated **organic traffic engine** for car accidents, **semi truck crashes**, and **severe injuries**.

## Output per run (every 15 minutes)

| Output | Location |
|--------|----------|
| **5** Claude blog posts | `content/blog/*.md` |
| Social copy (last post in batch) | `content/syndication/latest.json` |
| Topic queue | `content/autopilot/blog_queue.json` |

**Target ~240 blog posts/day** (96 scheduled slots × 5 posts; syndication on last post only for speed) · **226 cities** in queue

## GitHub Actions

**Workflow:** `.github/workflows/wreckmatch-traffic-machine.yml`  
**Schedule:** `*/15 * * * *` (every **15** minutes, **5 posts/run**)

Monitor: GitHub → Actions → should see **~90+ successful runs per day**. If fewer, use backup pinger below.

### Required secrets

| Secret | Purpose |
|--------|---------|
| `ANTHROPIC_API_KEY` | **Primary** — Claude posts + social copy |
| `OPENAI_API_KEY` | Fallback if Claude fails |
| `CRON_SECRET` | Triggers live `/api/automation/social` + `/api/automation/reddit` on wreckmatch.com |

### Vercel crons (backup)

Defined in `vercel.json` — social every 2h, Reddit every 4h (uses same APIs).

## Topic priority (queue)

1. **Priority 0:** Semi truck, 18-wheeler, severe injury, TBI, spinal, wrongful death (all Texas metros + national)
2. **Priority 1:** Standard car accident angles (Texas)
3. **Priority 2:** Other states

## CLI

```bash
pip install -r scripts/autopilot_requirements.txt

python scripts/wreckmatch_blog_autopilot.py --refill 500
python scripts/wreckmatch_blog_autopilot.py --batch 2 --ai --claude-first --syndicate
```

## Local 24/7 loop (most reliable for exactly 240/day)

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export BLOG_MACHINE_INTERVAL_SEC=1800   # 30 min → 48 runs × 5 = 240
export BLOG_MACHINE_BATCH=5
./scripts/run_blog_machine_local.sh
```

## Backup: external cron (if GitHub schedule is slow)

Use [cron-job.org](https://cron-job.org) to POST to GitHub API `workflow_dispatch` on `wreckmatch-traffic-machine` every 30 minutes with a fine-grained PAT (`actions:write`).

## Reddit / Twitter

- **Reddit:** needs `REDDIT_*` env vars on Vercel — helpful comments (max 5/day, 2h spacing)
- **Twitter/X:** syndication JSON ready to paste; API posting needs X API keys (future)
- **Files:** `content/syndication/{slug}.json` committed each run for manual Buffer/Hootsuite

## Cost estimate

| Mode | Daily cost (96 posts) |
|------|------------------------|
| Claude Sonnet | ~$40–90/day at **5 posts × 48 runs** (~240/day) |
| Template only (`--ai` off) | $0 |

Tune batch to `1` in workflow if you want lower cost (~$8–20/day).

## 800+ law firm network

Copy is included in posts: *"network of 800+ participating law firms"* — referral service disclaimer always present.
