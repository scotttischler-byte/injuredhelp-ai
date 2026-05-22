# WreckMatch Traffic Machine (24/7/365)

Automated **organic traffic engine** for car accidents, **semi truck crashes**, and **severe injuries**.

## Output per run (every 30 minutes)

| Output | Location |
|--------|----------|
| **5** Claude blog posts | `content/blog/*.md` |
| Social copy (X, LinkedIn, Facebook, Reddit) | `content/syndication/*.json` |
| Topic queue | `content/autopilot/blog_queue.json` |

**~240 blog posts/day** · **226 cities** in queue · **~5,000** topic combinations (22 angles × city)

## GitHub Actions

**Workflow:** `.github/workflows/wreckmatch-traffic-machine.yml`  
**Schedule:** `*/30 * * * *` (every 30 minutes, **5 posts/run**)

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

## Local 24/7 loop

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export BLOG_MACHINE_INTERVAL_SEC=1800   # 30 min
./scripts/run_blog_machine_local.sh
```

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
