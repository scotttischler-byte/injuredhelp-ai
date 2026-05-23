# Indexing automation (WreckMatch)

## What Google allows (important)

The Search Console **“Request indexing”** button has **no official API** for normal pages (car accident guides, blogs, geo pages).

| Method | Works for WreckMatch? |
|--------|------------------------|
| GSC → Request indexing (manual) | Yes, limited per day |
| Google Indexing API | **No** — only `JobPosting` / `BroadcastEvent` pages |
| Sitemap + internal links + quality | **Yes** — primary path |
| **IndexNow** (Bing, Yandex, etc.) | **Yes** — automated below |

If GSC says **“URL is not on Google”**, that usually means **not indexed yet** (new site, low trust, or quality/crawl limits) — not that the button is broken.

---

## One-time setup (15 minutes)

### 1. Create an IndexNow key

1. Go to [Bing IndexNow](https://www.bing.com/indexnow)  
2. Generate a key (example: `wreckmatch2026index`)  
3. Add the **same key** in two places:
   - **Vercel** → Project → Settings → Environment Variables → `INDEXNOW_KEY`
   - **GitHub** → repo → Settings → Secrets → `INDEXNOW_KEY`

After deploy, verify: `https://www.wreckmatch.com/{YOUR_KEY}.txt` shows the key as plain text.

### 2. Keep `CRON_SECRET` set

Used for `/api/indexing/notify` after each blog batch (same secret as social/reddit cron).

### 3. Google Search Console (manual, still required)

- Property: **https://www.wreckmatch.com** (www only)  
- Submit sitemap: `https://www.wreckmatch.com/sitemap.xml`  
- For pillar pages, use URL inspection → Request indexing **once per URL** (Google limits daily requests)

---

## What runs automatically

After each traffic-machine commit:

1. `scripts/indexing_accelerator.py` — sends priority + new blog URLs to **IndexNow**  
2. `POST /api/indexing/notify` on production (if `CRON_SECRET` set)  
3. New blog posts get **Related resources** footer links (pillar + city hub)  
4. RSS feed: `https://www.wreckmatch.com/blog/rss.xml`

Logs: `content/autopilot/indexing_log.jsonl`

---

## Manual commands

```bash
# Dry run — see URL list
python scripts/indexing_accelerator.py --dry-run

# Submit now (needs INDEXNOW_KEY)
INDEXNOW_KEY=your-key python scripts/indexing_accelerator.py

# Production API (after deploy)
curl -X POST https://www.wreckmatch.com/api/indexing/notify \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"slugs":["your-new-post-slug"]}'
```

---

## Why indexing still fails sometimes

- Site is new — Google can take **days to weeks**  
- **Thin/duplicate** blog posts — fix autopilot quality  
- Page not linked from sitemap or homepage — we link pillars + footers now  
- Wrong GSC property (non-www vs www)

**Do not** abuse Google’s Indexing API for non-job pages — risk of penalties.

---

## Weekly checklist

1. GSC → Pages → Indexed (should rise)  
2. Request indexing for **5–10** top money URLs (manual)  
3. Confirm GitHub Action “Notify search engines” step is green  
4. Read `indexing_log.jsonl` for IndexNow errors
