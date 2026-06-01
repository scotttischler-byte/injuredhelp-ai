# Why GitHub Actions fail (and how to fix)

## 1. `CRON_SECRET` mismatch → HTTP 401

**Symptom:** Organic autopilot / Exposure crush log:

```text
/api/exposure/cron HTTP 401
{"ok":false,"error":"unauthorized"}
```

**Cause:** GitHub repo secret `CRON_SECRET` ≠ Vercel Production `CRON_SECRET`.

**Fix (2 minutes):**

1. Vercel → **injuredhelp-ai** → Settings → Environment Variables → **Production** → copy `CRON_SECRET`.
2. GitHub → **injuredhelp-ai** → Settings → Secrets and variables → Actions → **CRON_SECRET** → Update (paste exact same value).
3. Re-run the failed workflow.

Optional: add `INDEXNOW_KEY` = `065536e9ab94b89a3451fd0f5ea4a193` (public; same as `https://www.wreckmatch.com/065536e9ab94b89a3451fd0f5ea4a193.txt`).

---

## 2. Git push rejected (`fetch first`)

**Symptom:**

```text
! [rejected] main -> main (fetch first)
```

**Cause:** Several bots (hourly, fifty-states, traffic-machine) push at the same time.

**Fix:** Workflows now use `scripts/ci/git_push_safe.sh` (pull --rebase before push). Pull latest `main` if you still see this on old runs.

---

## 3. Fifty states / hourly red when &lt; 50 states in one run

**Symptom:** `Final: 9/50 states` then `exit code 1`.

**Cause:** Old behavior treated a pulse as failure if the day wasn’t finished in one job.

**Fix:** `publish_fifty_states_now.py` exits **0** on partial progress; only **23:50 UTC verify** should fail if the day ends under 50 states. Stub posts are re-materialized to platinum.

---

## 4. GEO / Exposure crush exit 1 with `INDEXNOW_KEY not set`

**Symptom:** Log shows empty `INDEXNOW_KEY` on the runner.

**Fix:** `geo_automation.py` now defaults the key when the secret is missing. You can still set `INDEXNOW_KEY` on GitHub for clarity.

---

## Quick health check

```bash
gh run list --limit 10
gh run view RUN_ID --log-failed
PYTHONPATH=scripts python3 scripts/autopilot_daily_guard.py --verify-today --site wreckmatch
```
