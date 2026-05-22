# SEO / GEO / Mobile Launch Report — May 22, 2026

**Deployed to:** https://www.wreckmatch.com  
**Build:** 400 static pages · production build ✅

---

## Completed tasks (15/15)

| # | Task | Deliverable |
|---|------|-------------|
| 1 | Technical SEO/GEO audit | `docs/SEO_GEO_IMPLEMENTATION_PLAN.md` |
| 2 | Global metadata | `lib/seo/metadata.ts` → `buildPageMetadata()` |
| 3 | JSON-LD infrastructure | `lib/seo/schema.ts` (Org, Person, FAQ, HowTo, Article, WebPage, Service) |
| 4 | Mobile overhaul | Viewport, 48px targets, `MobileGlobalCTA`, globals.css |
| 5 | Entity pages | `/about-scott-tischler`, `/about-kathy-carr`, `/about-wreckmatch`, `/about-accident-survival-guide` |
| 6 | AI authority hub | `/ai-accident-help` |
| 7 | Topic clusters | `/car-accident-help`, `/truck-accident-help`, motorcycle, rideshare, pedestrian, uninsured |
| 8 | City/state engine | Existing 54 enriched + 226 geo (prior deploy) |
| 9 | Citation magnets | Checklist, glossary, timeline, insurance guide, truck evidence |
| 10 | Conversion forms | Existing `LeadForm` conversion variant + mobile CTA |
| 11 | 520 AI prompts | `public/ai-prompt-library.json` + `npm run generate:prompts` |
| 12 | Press/media | `/press` (existing), `/media-kit`, `/resources` |
| 13 | Technical files | `robots.ts`, `sitemap.xml`, `llms.txt`, `/ai.txt` |
| 14 | Components | TrustBar, FAQAccordion, CTASection, Breadcrumbs, RelatedGuides, shells |
| 15 | 90-day roadmap | `docs/90_DAY_AI_SEARCH_DOMINATION_ROADMAP.md` |

---

## Key URLs to verify

- https://www.wreckmatch.com/ai-accident-help  
- https://www.wreckmatch.com/truck-accident-help  
- https://www.wreckmatch.com/about-kathy-carr  
- https://www.wreckmatch.com/checklist-after-car-accident  
- https://www.wreckmatch.com/llms.txt  
- https://www.wreckmatch.com/ai.txt  
- https://www.wreckmatch.com/ai-prompt-library.json  

---

## AccidentSurvivalGuide.com (next)

ASG lives in separate codebase (`wreckmatch` repo). Phase 2: port `components/seo/*` and entity pages to `/accidentsurvivalguide` routes.

---

## Blogs

Traffic machine still running (~5 posts/30min). See prior status: ~40–52 posts indexed, scaling toward 240/day.

---

## Commands

```bash
npm run build
npm run generate:prompts
npm run export:geo
```
