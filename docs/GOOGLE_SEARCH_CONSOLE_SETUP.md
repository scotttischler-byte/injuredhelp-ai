# Google Search Console — WreckMatch.com

**Property:** `https://www.wreckmatch.com`  
**Sitemap:** `https://www.wreckmatch.com/sitemap.xml` (~386 URLs, growing daily)

---

## What is already done (technical)

| Item | Status |
|------|--------|
| `robots.txt` includes `Sitemap:` line | ✅ Live |
| Dynamic `sitemap.xml` (geo, blog, topic hubs, entities) | ✅ Live |
| `GOOGLE_SITE_VERIFICATION` meta tag support in `app/layout.tsx` | ✅ Code ready |
| Canonical URLs on pages | ✅ |

---

## Step 1 — Add property (you, ~2 minutes)

1. Open [Google Search Console](https://search.google.com/search-console)
2. Click **Add property**
3. Choose **URL prefix:** `https://www.wreckmatch.com`  
   (Use www — matches production canonicals)

---

## Step 2 — Verify ownership

### Option A — HTML meta tag (recommended, works with Vercel)

1. In GSC, pick **HTML tag** verification
2. Copy the `content="..."` value only (e.g. `abc123XYZ...`)
3. Add to **Vercel** → Project `injuredhelp-ai` → Settings → Environment Variables:

   | Name | Value | Environments |
   |------|-------|----------------|
   | `GOOGLE_SITE_VERIFICATION` | *(paste content value)* | Production |

4. Redeploy (or push any commit to `main`)
5. Click **Verify** in Search Console

### Option B — DNS (if you control wreckmatch.com DNS)

1. GSC → **Domain name provider** → copy TXT record
2. Add TXT at your DNS host (Cloudflare, etc.)
3. Verify (can take up to 24h)

### Option C — Google Tag Manager

If `NEXT_PUBLIC_GTM_ID` is already on the live site, GSC may offer **Google Tag Manager** verification in one click.

---

## Step 3 — Submit sitemap

After verification:

1. GSC → **Sitemaps** (left menu)
2. Enter: `sitemap.xml`
3. Click **Submit**

Full URL submitted: `https://www.wreckmatch.com/sitemap.xml`

---

## Step 4 — Request indexing (priority URLs)

GSC → **URL inspection** → paste each URL → **Request indexing**

Priority batch:

- `https://www.wreckmatch.com/`
- `https://www.wreckmatch.com/truck-accident-help`
- `https://www.wreckmatch.com/car-accident-help`
- `https://www.wreckmatch.com/car-accident-help-houston`
- `https://www.wreckmatch.com/car-accident-help-texas`
- `https://www.wreckmatch.com/ai-accident-help`

---

## Step 5 — Optional: AccidentSurvivalGuide.com

Repeat steps 1–3 for `https://www.accidentsurvivalguide.com` on its Vercel project when ready.

---

## Weekly monitoring

| Report | What to watch |
|--------|----------------|
| Performance | Clicks/impressions for `car accident lawyer`, `truck accident` |
| Pages | Indexed vs not indexed (blog growth) |
| Core Web Vitals | Mobile LCP/CLS |
| Sitemaps | Last read date, errors |

---

## Troubleshooting

- **www vs non-www:** Property must be `https://www.wreckmatch.com` (site redirects bare domain to www).
- **Sitemap “Couldn't fetch”:** Confirm https://www.wreckmatch.com/sitemap.xml opens in browser.
- **Low indexing:** Normal for new pages; blog adds ~240 URLs/day — expect gradual crawl.

---

*Agent cannot log into your Google account. Complete Steps 1–3 in the browser; paste the verification token here if you want it added to Vercel via CLI.*
