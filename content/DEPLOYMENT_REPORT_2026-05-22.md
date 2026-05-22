# WreckMatch National Domination — Deployment Report

**Date:** May 22, 2026  
**Production:** https://www.wreckmatch.com  
**Repository:** https://github.com/scotttischler-byte/injuredhelp-ai  
**Commit:** `e7f3b01` — *feat(geo): national priority city pages, accident variants, and UX fixes*  
**Vercel:** Deployment completed successfully on `main`

---

## Executive summary

The full national geo package is live on production. The site now ships **381 pre-built pages**, including **54 enriched priority city guides**, **9 priority state hubs**, and **24 accident-type variant pages** (truck / Uber-Lyft / motorcycle). Homepage copy targets national attorney keywords. UX fixes for blur/timeout are included in this deploy.

**Change size:** 94 files, +6,353 lines

---

## What shipped

### Priority city pages (54 metros)

Dark emerald UI, multi-section guides (stats tables, SOL, insurance tactics, mistakes, FAQs), JSON-LD (FAQPage + HowTo + LocalBusiness), conversion form + **855 WRECKMATCH** on every page.

| Region | Cities |
|--------|--------|
| Texas (20) | Houston, San Antonio, Dallas, Austin, Fort Worth, El Paso, Arlington, Corpus Christi, Plano, Lubbock, Irving, Garland, Frisco, McKinney, Grand Prairie, Amarillo, Brownsville, Killeen, Pasadena, Laredo |
| California (6) | LA, San Diego, San Jose, SF, Sacramento, Fresno |
| Florida (4) | Jacksonville, Miami, Tampa, Orlando |
| Georgia (4) | Atlanta, Columbus, Augusta, Savannah |
| Illinois (3) | Chicago, Aurora, Joliet |
| Alabama (3) | Birmingham, Montgomery, Mobile |
| Tennessee (3) | Nashville, Memphis, Knoxville |
| Colorado (3) | Denver, Colorado Springs, Aurora |
| Washington (3) | Seattle, Spokane, Tacoma |
| NYC (5) | NYC, Manhattan, Brooklyn, Queens, Bronx |

**Sample URLs:**

- `/car-accident-help-houston`
- `/car-accident-help-los-angeles`
- `/car-accident-help-manhattan`
- `/car-accident-help-texas`

### Accident-type variants (24 pages)

8 cities × 3 types: truck, rideshare, motorcycle.

Examples: `/car-accident-help-houston/truck`, `/car-accident-help-miami/rideshare`

### State hub pages (9)

Texas, California, Florida, Georgia, Illinois, Alabama, Tennessee, Colorado, Washington — enriched hubs with metro link grids.

### Homepage & conversion

- Hero: national car accident / PI / truck keywords
- Conversion form with 855 WRECKMATCH
- Sticky mobile bar; exit-intent (blur fix)
- Duplicate mobile bar removed

### Content & ops assets

| Asset | Path |
|-------|------|
| Master template | `content/geo-templates/MASTER_CITY_PAGE_TEMPLATE.md` |
| Exported markdown | `content/geo-pages/` (54 cities + 9 state hubs) |
| Publishing schedule | `content/PUBLISHING_SCHEDULE_30_60_90.md` |
| Automation notes | `content/AUTOMATION_NOTES.md` |
| Registry | `lib/priority-places/registry.ts` |
| Export command | `npm run export:geo` |

### SEO infrastructure

- Sitemap includes variant URLs (priority 0.88)
- Priority metros at 0.92
- Middleware rewrites variant paths

---

## Traffic machine (ongoing)

| Setting | Value |
|---------|--------|
| Workflow | `.github/workflows/wreckmatch-traffic-machine.yml` |
| Schedule | Every 30 minutes |
| Posts per run | 5 (~240/day) |
| Cities in queue | 226 |
| Model | Claude Sonnet 4.6 |

---

## Scale vs. 1,000-city goal

| Layer | Count | Notes |
|-------|-------|--------|
| Enriched priority cities | 54 | Full template live |
| Geo cities in database | 226+ | Lighter template, indexed |
| Accident variants | 24 | Top 8 metros |
| Static pages (build) | 381 | Verified at deploy |

**Next:** Extend registry in batches per `PUBLISHING_SCHEDULE_30_60_90.md`.

---

## QA checklist

1. Homepage — hero + form
2. `/car-accident-help-houston` — enriched guide
3. `/car-accident-help-houston/truck` — variant + form
4. `/car-accident-help-california` — state hub
5. `/sitemap.xml` — variant URLs
6. Exit-intent — no full-page blur

---

## Commands

```bash
npm run export:geo   # Re-export markdown from registry
npm run dev          # Local preview
```
