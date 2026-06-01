# CURSOR_SECRET_SAUCE — GEO / AI Visibility Playbook

**Give this file to Cursor as system context on any client project** (WreckMatch, SemiTruckMatch, InjuredHelp.ai, AccidentSurvivalGuide, Bobby Garcia, etc.).

Visual reference: `/secret-sauce.html` on any deployed host (e.g. `https://www.wreckmatch.com/secret-sauce.html`).

---

## 1. robots.txt — do NOT block AI crawlers

Most sites accidentally use `Disallow: /` for bots or omit AI agents. **Required allow list:**

```
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: OAI-SearchBot
User-agent: ClaudeBot
User-agent: anthropic-ai
User-agent: PerplexityBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: cohere-ai
User-agent: Bytespider
User-agent: CCBot
Allow: /
Allow: /blog/
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /ai.txt
Disallow: /api/
Disallow: /admin
```

**Next.js:** `app/robots.ts` with `siteOriginFromHeaders()` so each domain gets its own sitemap host.

---

## 2. JSON-LD — required schemas and fields

Always output **valid JSON-LD** in `<script type="application/ld+json">`. Combine with `@graph` on layout roots when needed.

### Organization
```json
{
  "@type": "Organization",
  "name": "Brand Name",
  "url": "https://www.example.com",
  "logo": "https://www.example.com/logo.png",
  "telephone": "+1XXXXXXXXXX",
  "areaServed": { "@type": "Country", "name": "United States" },
  "sameAs": ["https://www.linkedin.com/company/..."]
}
```

### WebSite
```json
{
  "@type": "WebSite",
  "url": "https://www.example.com",
  "name": "Brand Name",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.example.com/blog?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### Article (blog / guides)
Required: `headline`, `description`, `datePublished`, `dateModified`, `author` (Person), `publisher` (Organization + logo), `image`, `mainEntityOfPage`.

### FAQPage
```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Question text?",
    "acceptedAnswer": { "@type": "Answer", "text": "Plain-text answer." }
  }]
}
```
**Week-1 tactic:** Add FAQPage to top 10 existing posts + pillar pages (`/truck-accident-help`, `/car-accident-help`) — 2 hours, high citation impact.

### HowTo (checklists)
`name`, `description`, `step[]` with `position`, `name`, `text`.

### Service (matching / referral)
`serviceType`, `provider`, `areaServed`, `offers.price: "0"`.

Use `lib/seo/schema.ts` + `PageFaqBlock` — never hardcode "WreckMatch" on SemiTruckMatch hosts.

---

## 3. HTML article DOM — what AI crawlers expect

```html
<article itemscope itemtype="https://schema.org/Article">
  <meta itemprop="headline" content="Title" />
  <meta itemprop="datePublished" content="2026-05-31" />
  <nav aria-label="Breadcrumb">…</nav>
  <h1>Primary headline (one per page)</h1>
  <p class="byline"><time datetime="2026-05-31">May 31, 2026</time> · Author Name, credentials</p>
  <figure><img alt="Descriptive alt" … /></figure>
  <div class="prose">
    <h2>Section with specific data</h2>
    <table>…comparison table…</table>
  </div>
  <section aria-labelledby="faq-heading">
    <h2 id="faq-heading">Frequently asked questions</h2>
    <details itemscope itemtype="https://schema.org/Question">
      <summary itemprop="name">Question?</summary>
      <div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
        <p itemprop="text">Answer.</p>
      </div>
    </details>
  </section>
</article>
```

---

## 4. Ten content rules (Cursor must enforce on every article)

1. **Answer in the first 120 words** — direct answer to the query intent (state + accident type).
2. **One H1, logical H2/H3** — no keyword stuffing; headings are questions people ask LLMs.
3. **At least one data table** — statutes, deadlines, insurance limits, or comparison vs. other states.
4. **Dates everywhere** — `datePublished`, visible "Last updated May 2026", and 2026 in title where accurate.
5. **Named author + reviewer** — Person schema; E-E-A-T for legal YMYL.
6. **8–12 FAQs** — mirror ChatGPT/Perplexity question phrasing; use `<details>` + FAQPage JSON-LD.
7. **Internal links** — hub (`/states`, `/blog`), sibling state pages, `/truck-accident-help` or `/car-accident-help`, `/#form`.
8. **2000+ words** (3000+ for platinum) — depth beats thin AI summaries.
9. **Unique local facts** — state statute cite, filing deadline, insurer behavior — not generic filler.
10. **EN + ES mirror** — `/es/blog/{slug}` for Hispanic citation surface.

---

## 5. IndexNow — Node.js auto-submission

Key file at site root: `https://www.{domain}.com/{INDEXNOW_KEY}.txt` containing only the key.

```typescript
import { submitIndexNowBatch } from "@/lib/indexnow";
import { buildIndexNowUrlsForSite } from "@/lib/exposure-index";

const key = process.env.INDEXNOW_KEY!;
const urls = buildIndexNowUrlsForSite("https://www.wreckmatch.com", "wreckmatch", {
  recentBlogLimit: 320,
  recentEsLimit: 320,
});
await submitIndexNowBatch("https://www.wreckmatch.com", key, urls);
```

**Multi-site:** Crons call `submitIndexNowAllSites()` — see `config/geo-sites.json`.

**Perplexity–Bing bridge:** Perplexity uses Bing's live index. IndexNow → Bing in **2–6 hours**. Publish 9am → cite by 5pm on long-tail is realistic.

---

## 6. WordPress plugin patterns (non-Next clients)

- **Rank Math / Yoast:** Enable FAQ block → auto FAQPage schema.
- **Custom plugin hook:** On `publish_post`, `wp_remote_post` to IndexNow API with `host`, `key`, `urlList`.
- **Must-use plugin:** Inject `llms.txt` via rewrite; allow AI bots in virtual `robots.txt` if theme blocks `/wp-json/`.
- **Table of contents:** Use `<h2 id="...">` anchors — LLMs extract structured sections.

---

## 7. GEO score calculator

```typescript
import { calculateGeoScore } from "@/lib/geo-score";

const result = calculateGeoScore({
  robotsAllowsAiCrawlers: true,
  llmsTxt: true,
  articleJsonLd: true,
  faqPageJsonLd: true,
  semanticArticleDom: true,
  faqDetailsOrHeadings: true,
  hasComparisonTable: true,
  wordCount: 3200,
  authorByline: true,
  contentDateRecent: true,
  indexNowKeyDeployed: true,
});
// result.score → 0–100, result.grade → A–F, result.gaps → fix list
```

CLI: `node scripts/geo-audit-url.mjs https://www.wreckmatch.com/blog/slug`

---

## 8. 24-hour tactics most people miss

| Tactic | Action | Impact |
|--------|--------|--------|
| **GBP Q&A** | Add 10 Q&As in Google Business Profile with target keywords | Same-day local AIO |
| **Wikidata entity** | Create brand item (P856 website, P1448 label) | Entity disambiguation in LLMs |
| **Competitor reverse-engineering** | Query ChatGPT + Perplexity for 10 keywords; screenshot citations; beat with tables + dates | Content brief before writing |
| **FAQ on existing pages** | FAQPage on top 10 URLs programmatically | Week-1 citation bump |
| **IndexNow on publish** | Append slug to `indexnow_pending.json`; cron every 4h | Same-day Perplexity on long-tail |

---

## 9. Repo map (injuredhelp.ai monorepo)

| Asset | Path |
|-------|------|
| Robots | `app/robots.ts` |
| Schema | `lib/seo/schema.ts` |
| FAQ block | `components/seo/PageFaqBlock.tsx` |
| IndexNow | `lib/indexnow.ts`, `lib/exposure-index.ts` |
| Multi-site config | `config/geo-sites.json` |
| GEO score | `lib/geo-score.ts` |
| Cursor rule | `.cursor/rules/cursor-secret-sauce.mdc` |
| Playbook HTML | `public/secret-sauce.html` |

**Domains on one Vercel deploy:** wreckmatch.com, semitruckmatch.com, injuredhelp.ai — host header drives brand (`lib/site.ts`, `middleware.ts`).

---

## 10. Competitor comparison (what we do vs. typical PI site)

| Signal | Typical competitor | Our stack |
|--------|-------------------|-----------|
| AI robots | Blocked or ignored | Explicit allow + `llms.txt` |
| Schema | None or broken Article | Article + FAQPage + Organization |
| FAQ | Footer boilerplate | 8–12 `<details>` + JSON-LD |
| Indexing | Sitemap only | IndexNow every 4h all domains |
| Content depth | 600-word thin posts | 2000–4000 word platinum + tables |
| Spanish | None | `/es/blog` mirrored |
| Entity | No Wikidata | Manual Wikidata + GBP Q&A ops |

---

*Last updated: 2026-05-31. When starting a new client site, copy this file + `public/secret-sauce.html` into that repo and add a `.cursor/rules` pointer.*
