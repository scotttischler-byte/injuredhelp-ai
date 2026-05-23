# Full automation runbook — WreckMatch

Goal: **no daily manual work** for content, deploy, IndexNow, and social/reddit crons.

---

## What runs automatically (24/7)

| System | Schedule | What it does |
|--------|----------|----------------|
| **GitHub: traffic machine** | Every 15 min | 5 blog posts → commit → push → Vercel deploy → IndexNow via `/api/indexing/notify` → social/reddit hooks |
| **Vercel: indexing cron** | Every 4 hours | `/api/indexing/cron` — latest 120 posts + pillar URLs → IndexNow |
| **Vercel: social** | Every 2 hours | `/api/automation/social` |
| **Vercel: reddit** | Every 4 hours | `/api/automation/reddit` (needs Reddit API keys) |
| **GitHub: health check** | Daily 14:00 UTC | Calls `/api/automation/health` + `/api/indexing/cron` |

---

## Required secrets (one-time — you did this)

| Where | Name | Status |
|-------|------|--------|
| Vercel Production | `CRON_SECRET` | Required |
| Vercel Production | `INDEXNOW_KEY` | Required |
| Vercel Production | `ANTHROPIC_API_KEY` | For AI posts (optional → templates) |
| GitHub Actions | `CRON_SECRET` | Required (same value as Vercel) |
| GitHub Actions | `ANTHROPIC_API_KEY` | Recommended |

Local backup: `.secrets-setup` (never commit).

---

## What cannot be fully automated

| Task | Why | Minimum manual |
|------|-----|----------------|
| **Google “Request indexing”** | No API for normal pages | 3–5 URLs/week in Search Console |
| **Google ranking** | Algorithm + time | Wait 2–6 weeks; watch GSC |
| **Reddit posting** | Needs `REDDIT_CLIENT_ID` + approval | Add keys once in Vercel |
| **Press outreach** | Human relationships | Optional weekly |

---

## Enable GitHub Actions (if off)

https://github.com/scotttischler-byte/injuredhelp-ai/settings/actions  
→ **Allow all actions**

---

## Verify automation (once)

```bash
# After CRON_SECRET is in .secrets-setup:
source .secrets-setup
curl -s -H "Authorization: Bearer $CRON_SECRET" \
  https://www.wreckmatch.com/api/automation/health | python3 -m json.tool
```

Expect `"ok": true`.

---

## If something stops

1. **GitHub Actions** → last traffic machine run red? → check `ANTHROPIC_API_KEY`, quota, or rate limits.  
2. **Vercel** → Deployments failing? → build log.  
3. **IndexNow 403** → key file https://www.wreckmatch.com/{INDEXNOW_KEY}.txt  
4. **No Google traffic** → normal early on; use GSC URL inspection on pillars.

---

## Optional: VPS backup (100% publish reliability)

If GitHub schedule is slow:

```bash
export ANTHROPIC_API_KEY=...
export BLOG_MACHINE_BATCH=5
export BLOG_MACHINE_INTERVAL_SEC=1800
./scripts/run_blog_machine_local.sh
```

---

## Your role now

**~5 min/week:** GSC → check Indexed count + request indexing for 3–5 top URLs.  
**Everything else:** automated.
