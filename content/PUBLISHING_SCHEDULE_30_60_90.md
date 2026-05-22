# WreckMatch National Geo Publishing Schedule (May 2026)

**Goal:** ~226 enriched city pages + 9 priority state hubs + 24 accident-type variants, published in batches that maximize Texas and priority-state rankings first.

## Phase 1 — Days 1–30 (Texas + live conversion)

| Week | Publish | Count (approx.) | Notes |
|------|---------|-----------------|-------|
| 1 | Texas Tier-1 metros (Houston, Dallas, Austin, San Antonio, Fort Worth) + state hub | 6 | Already enriched — verify JSON-LD, internal links |
| 2 | Texas Tier-2 (El Paso, Arlington, Corpus Christi, Plano, Lubbock, Irving) + truck/Uber/moto for Houston/Dallas/Austin | 9 | 3 variants × 3 cities |
| 3 | Remaining Texas metros (Garland, Frisco, McKinney, Laredo, Amarillo, etc.) | 10–15 | Add to `lib/cities.ts` + registry |
| 4 | Texas accident variants (remaining top cities) + blog cross-links | 6+ | Link geo → blog autopilot |

**Daily blog autopilot (existing):** ~240 posts/day via GitHub Actions — keep running; geo pages are the “money pages.”

## Phase 2 — Days 31–60 (Priority states)

| Week | Publish | Count (approx.) |
|------|---------|-----------------|
| 5 | California hubs + LA, San Diego, SF, San Jose, Sacramento, Fresno | 7 |
| 6 | Florida + Georgia state hubs + major cities | 10 |
| 7 | Illinois, Alabama, Tennessee | 10 |
| 8 | Colorado, Washington + accident variants (LA, Chicago, Atlanta, Miami, Nashville) | 14 |

## Phase 3 — Days 61–90 (NYC + scale)

| Week | Publish | Count (approx.) |
|------|---------|-----------------|
| 9 | NYC + Manhattan, Brooklyn, Queens, Bronx | 5 |
| 10–12 | Remaining cities from `lib/cities.ts` (batch 20–40/week) | 60–120 |
| 13 | Internal link audit, sitemap resubmit, Search Console | — |

## Internal linking rules

1. Every **city page** links up to **state hub** and sideways to 3–6 peer cities in the same state.
2. Every **state hub** lists all priority metros with anchor text `car accident help in [City]`.
3. **Accident variants** link back to base city page + state hub + matching blog post.
4. Homepage hero links to Texas hub + top 5 metros.
5. Blog autopilot posts should include 2+ internal links to geo pages when city is mentioned.

## Quality gates (review 3–5 samples each batch)

- [ ] Disclaimer on page + form
- [ ] 855 WRECKMATCH + (855) 897-3256 visible above fold and after each major section
- [ ] Unique local highways / hospitals / crash note
- [ ] FAQPage + HowTo + LocalBusiness JSON-LD validates
- [ ] No duplicate title/H1 across same state

## Metrics to watch

- Google Search Console: impressions for `car accident lawyer [city]`
- Form submissions by `source=geo-*` in CRM/logs
- Crawl stats — ensure sitemap includes new `/car-accident-help-*` URLs
