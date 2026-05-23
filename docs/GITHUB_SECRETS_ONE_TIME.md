# One-time GitHub secrets (2 minutes in browser)

IndexNow key is already on **Vercel**. GitHub only needs **`CRON_SECRET`** so Actions can call production indexing after each blog batch.

## Steps

1. Open (while logged into GitHub):  
   https://github.com/scotttischler-byte/injuredhelp-ai/settings/secrets/actions

2. If **`CRON_SECRET`** is missing → **New repository secret**  
   - Name: `CRON_SECRET`  
   - Value: same as Vercel → Project **injuredhelp-ai** → Settings → Environment Variables → Production → `CRON_SECRET`

3. Optional (not required — Vercel has it): **`INDEXNOW_KEY`**  
   - Value: `065536e9ab94b89a3451fd0f5ea4a193`

4. Done. Traffic machine will call `https://www.wreckmatch.com/api/indexing/notify` after each publish.

## Terminal alternative

```bash
gh auth login
./scripts/setup-indexnow-github-secret.sh 065536e9ab94b89a3451fd0f5ea4a193
gh secret set CRON_SECRET --repo scotttischler-byte/injuredhelp-ai
# paste CRON_SECRET when prompted
```
