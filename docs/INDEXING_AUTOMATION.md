# IndexNow setup (official protocol)

Docs: [indexnow.org/documentation](https://www.indexnow.org/documentation)

## 1. Generate a valid key

- **8–128 characters**
- Only `a-z`, `A-Z`, `0-9`, `-`

```bash
openssl rand -hex 16
# Example: 394c7e5033a44ebb980d1c946bd22d9f
```

## 2. Host the key file (Option 1 — recommended)

File URL: `https://www.wreckmatch.com/{YOUR_KEY}.txt`  
File content: **only the key** (no extra text, no quotes).

We serve this via `INDEXNOW_KEY` on Vercel + rewrite in `next.config.ts`.

**Set the same value in:**

- Vercel → `INDEXNOW_KEY`
- GitHub → Secrets → `INDEXNOW_KEY`

Redeploy, then verify:

```bash
INDEXNOW_KEY=your-key python scripts/indexing_accelerator.py --verify-key
```

Or open `https://www.wreckmatch.com/YOUR_KEY.txt` in the browser — it should show exactly your key.

## 3. Submit URLs

### Single URL (GET — good for testing)

```bash
INDEXNOW_KEY=your-key python scripts/indexing_accelerator.py \
  --url "https://www.wreckmatch.com/what-to-do-after-a-car-accident"
```

Equivalent manual curl:

```bash
curl "https://www.bing.com/indexnow?url=https%3A%2F%2Fwww.wreckmatch.com%2Fwhat-to-do-after-a-car-accident&key=YOUR_KEY"
```

### Batch (POST — used after blog publishes)

```bash
npm run indexing:notify
```

Up to **10,000 URLs** per POST. We submit HTML pages only (not `sitemap.xml` / `llms.txt`).

Endpoints: `api.indexnow.org`, `bing.com`, `yandex.com`

### Response codes

| Code | Meaning |
|------|---------|
| **200** | OK — received |
| **202** | Accepted — key validation pending |
| **403** | Key invalid or key file wrong/missing |
| **422** | URL not on host or bad format |
| **429** | Too many requests — slow down |

**200/202 only means the engine received the URL** — not guaranteed indexing.

## 4. Google Search Console (separate)

IndexNow does **not** replace Google. Still use GSC manually for critical URLs (limited per day).

Google has **no** general “Request indexing” API for our page types.

## 5. Automation

After each traffic-machine commit, GitHub Actions runs `scripts/indexing_accelerator.py` and calls `POST /api/indexing/notify` (needs `CRON_SECRET`).

Logs: `content/autopilot/indexing_log.jsonl`
