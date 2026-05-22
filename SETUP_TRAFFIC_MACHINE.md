# Traffic machine — setup for Scott (vibecode edition)

Everything below is **already in the repo** on `main`. You only need **~5 minutes** once to turn on secrets and click Run.

## What runs automatically

| Piece | What it does |
|-------|----------------|
| **GitHub** `wreckmatch-traffic-machine.yml` | Every **30 min**: 2 blog posts → push → Vercel deploy |
| **Vercel crons** | Social + Reddit APIs on wreckmatch.com (needs `CRON_SECRET`) |
| **Your stack** | GHL webhook, Twilio, Retell — already on Vercel for **leads** |

**~96 new SEO pages/day** without you touching code.

## One command (recommended)

```bash
cd ~/injuredhelp.ai
chmod +x scripts/setup-traffic-machine.sh
./scripts/setup-traffic-machine.sh
```

That script:

1. Generates `CRON_SECRET` (saved in `.secrets-setup`, never committed)
2. Pushes it to **Vercel** if the CLI is logged in
3. Tells you exactly what to paste into **GitHub** if `gh` isn’t logged in

Then redeploy once:

```bash
vercel --prod
```

## GitHub (2 minutes if gh isn’t set up)

1. Open [Actions secrets](https://github.com/scotttischler-byte/injuredhelp-ai/settings/secrets/actions)
2. Add **CRON_SECRET** — same value as in `.secrets-setup`
3. (Optional) **ANTHROPIC_API_KEY** — Claude writes posts (~$15–40/day at full volume). **Skip this** to run **free template posts** (still ~96/day).
4. Open [Run workflow](https://github.com/scotttischler-byte/injuredhelp-ai/actions/workflows/wreckmatch-traffic-machine.yml) → **Run workflow** → batch `2`, refill `500`

Make sure **Actions** are enabled: [repo Actions settings](https://github.com/scotttischler-byte/injuredhelp-ai/settings/actions).

If the workflow fails on **git push**, allow the bot to write to `main`:  
**Settings → Actions → General → Workflow permissions → Read and write**, and if you use branch protection, check **Allow GitHub Actions to create and approve pull requests** or add an exception for `github-actions[bot]`.

## Login GitHub CLI (optional, so the script sets secrets for you)

```bash
gh auth login
./scripts/setup-traffic-machine.sh
```

## 800 leads/day — honest picture

| Layer | This repo | You / ads |
|-------|-----------|-----------|
| **Traffic** | Blog + Texas city pages + AI visibility | Google/Meta ads, TikTok |
| **Leads** | Forms → GHL (already wired on Vercel) | Budget, landing tests, call tracking |
| **800 firms** | Copy in posts + routing story | Firm onboarding / GHL pipelines |

The traffic machine **feeds Google and AI search**. Leads scale with **ad spend + conversion**, not post count alone. **800/day** is a strong target — treat **50–100 qualified leads/day** as a great first milestone once ads + machine are both on.

## If something breaks

- **Workflow red?** → Actions tab → click run → read log. Missing `CRON_SECRET` only skips social/reddit curl; posts still publish.
- **No new posts?** → Run workflow manually with refill `500`.
- **Admin check** → https://www.wreckmatch.com/admin (automation page lists env status)

## Links

- Live site: https://www.wreckmatch.com  
- Repo: https://github.com/scotttischler-byte/injuredhelp-ai  
- Ops detail: `content/autopilot/README.md`
