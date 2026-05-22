# SEO / GEO Implementation Plan — WreckMatch & Accident Survival Guide

**Date:** May 22, 2026  
**Status:** Phase 1 deployed on wreckmatch.com (`injuredhelp.ai` repo)

---

## 1. Audit summary

### Strengths (post-implementation)

| Area | Status |
|------|--------|
| Geo city pages (54 priority) | ✅ Enriched + JSON-LD |
| Blog autopilot (~240/day target) | ✅ GitHub Actions |
| llms.txt + ai.txt | ✅ Live |
| Schema (Org, Person, FAQ, HowTo, Service, Article, WebPage) | ✅ `lib/seo/schema.ts` |
| Topic clusters (car, truck, rideshare, etc.) | ✅ `/truck-accident-help` priority |
| Entity pages (Scott, Kathy, brands) | ✅ |
| AI hub | ✅ `/ai-accident-help` |
| Citation assets (checklist, glossary, timeline) | ✅ |
| Mobile sticky CTA | ✅ `MobileGlobalCTA` + conversion form |
| 500+ AI prompt library | ✅ `/ai-prompt-library.json` |
| Sitemap + robots (AI crawlers) | ✅ |

### Gaps (Phase 2)

- AccidentSurvivalGuide.com — mirror entity/GEO patterns on separate deploy (`wreckmatch` repo `/accidentsurvivalguide`)
- Remaining ~170 cities — generic template → enriched registry batches
- hreflang / Spanish parity on new pages
- Core Web Vitals lab monitoring in Search Console
- Reddit/X auto-post credentials on Vercel

---

## 2. Technical architecture

```
lib/entities.ts          → People + brands (E-E-A-T)
lib/seo/metadata.ts      → buildPageMetadata()
lib/seo/schema.ts        → JSON-LD graph builders
lib/topic-hubs.ts        → Topic cluster definitions
lib/citation-assets.ts   → Citation magnet registry
lib/priority-places/     → City/state content engine
components/seo/*         → TrustBar, FAQ, CTA, Breadcrumbs, shells
app/ai.txt               → Experimental AI policy
app/llms.txt             → LLM summary (dynamic)
```

---

## 3. Metadata standards

- **Title:** Primary keyword + brand + year when relevant (≤60 chars ideal)
- **Description:** Direct answer + CTA + disclaimer hint (≤160 chars)
- **Canonical:** Always set via `buildPageMetadata`
- **Keywords:** Optional array for legacy crawlers
- **robots:** index,follow except admin

---

## 4. Schema checklist (per page type)

| Page type | Required schema |
|-----------|-----------------|
| Homepage | Organization, WebSite, Service |
| City geo | FAQPage, HowTo, LocalBusiness, BreadcrumbList |
| Topic hub | FAQPage, WebPage, BreadcrumbList |
| Blog post | Article, FAQPage (if FAQs) |
| About person | Person, Organization |
| Citation guide | FAQPage, HowTo (when steps) |

---

## 5. GEO (Generative Engine Optimization)

1. **Information islands** — self-contained H2 sections with direct answers first  
2. **Tables & lists** — easy for LLMs to extract  
3. **llms.txt / ai.txt** — machine-readable site maps  
4. **Entity graph** — CEO/founder pages linked from Organization schema  
5. **Prompt library** — 500+ natural queries for content QA and gap analysis  
6. **Internal linking** — topic hubs → cities → citation assets → form  

---

## 6. Mobile requirements (implemented)

- Viewport + `viewport-fit: cover`  
- 16px+ inputs (no iOS zoom)  
- 48px min touch targets  
- Site-wide mobile sticky bar (phone + form)  
- `pb` safe-area on authority pages  
- No `backdrop-blur` stacking (GPU)  

---

## 7. Compliance (all templates)

- WreckMatch LLC — referral service, not a law firm  
- No guaranteed outcomes  
- 855 WRECKMATCH + dialable digits  
- TCPA on forms  
- State-specific SOL disclaimers  

---

## 8. Measurement

| KPI | Tool |
|-----|------|
| Index coverage | Google Search Console |
| AI referrals | Referrer logs, Perplexity/Poe UTMs |
| Leads by source | `source=` on LeadForm |
| Blog volume | `blog_queue.json` stats |
| CWV mobile | PageSpeed / CrUX |

---

## 9. File index (new)

See `content/DEPLOYMENT_REPORT_2026-05-22.md` and git commit log for full file list.
