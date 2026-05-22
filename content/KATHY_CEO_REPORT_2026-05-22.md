# WreckMatch Organic Growth System — CEO Brief for Kathy

**Prepared for:** Kathy, CEO  
**Date:** May 22, 2026  
**From:** Product / growth engineering (WreckMatch.com deployment)  
**Re:** What we built, what it should produce, and cost/time vs. hiring a U.S. team

---

## 1. What we built (in plain English)

We deployed a **national “traffic machine”** on wreckmatch.com — not a handful of blog posts, but a **structured legal-referral content system** designed to rank in Google and AI search (ChatGPT, Perplexity, etc.) when people look for help after a car crash.

**Three engines work together:**

| Engine | What it does |
|--------|----------------|
| **Money pages (geo)** | City and state landing pages with local detail, disclaimers, phone, and lead forms — built to convert visitors into matched attorney leads. |
| **Accident-type pages** | Truck, Uber/Lyft, and motorcycle variants for our highest-value metros (Houston, Dallas, Austin, LA, Chicago, Atlanta, Miami, Nashville). |
| **Blog autopilot** | Runs 24/7 on GitHub — about **240 new articles per day** across **226 U.S. cities**, prioritizing Texas and other target states. |

**Also live:** Homepage tuned for “car accident lawyer” and “personal injury attorney,” **855 WRECKMATCH** everywhere, mobile sticky bar, and form fixes so the site does not “go blurry” and frustrate users.

**Deployed May 22, 2026** — live at https://www.wreckmatch.com (commit `e7f3b01`, Vercel production ✅).

---

## 2. What this is designed to do for WreckMatch

### Business purpose

1. **Own local search intent** — When someone searches “car accident lawyer Houston” or “what to do after accident in Texas,” we want WreckMatch to appear as the helpful guide that **ends with a free attorney match**, not as a random ad.
2. **Feed AI answers** — Structured FAQs, tables, and “information islands” are written so AI systems can **cite and link** to us as a source (GEO / AI visibility).
3. **Scale without linear headcount** — One playbook (template + registry + automation) can cover hundreds of cities; humans review samples, not every paragraph.
4. **Support the referral model** — Every major section pushes **form + 855 WRECKMATCH** with clear “we are a referral service, not a law firm” disclaimers.

### What it should generate (expectations)

These are **ranges**, not guarantees. Legal SEO is competitive and depends on indexing speed, domain authority, and conversion rate.

| Metric | Conservative (90 days) | Moderate (6–12 months) | Aggressive (12+ months, full indexation) |
|--------|------------------------|-------------------------|------------------------------------------|
| **Indexed pages** | 500–2,000+ URLs (geo + blog) | 10,000–50,000+ URL variants over time | Very large long-tail footprint |
| **Organic sessions/month** | 25k–100k | 150k–500k | 500k–2M+ |
| **Form + call leads/month** | 500–2,500 | 3,000–15,000 | 15,000–50,000+ |
| **Leads per day (steady state)** | 15–80 | 100–500 | 500–1,600+ |

**Connection to company goal:** Leadership has discussed **~800 leads per day** as a north star. This system is **architected for that scale** (volume of pages + daily content + conversion UX), but hitting 800/day requires **strong conversion rate**, **nationwide attorney supply**, and **6–18 months** of compounding SEO — not overnight.

**Revenue framing (illustrative only):** If WreckMatch earns **$X per matched lead** and converts **Y%** of form submissions, multiply monthly leads × $X × Y. Kathy’s finance team should plug in actual unit economics.

### Leading indicators to watch (first 30–60 days)

- Google Search Console: impressions/clicks on `car accident` + city terms  
- Leads tagged `source=geo-*` and `source=homepage` in CRM  
- Index coverage in Search Console (geo + blog URLs)  
- Cost per day on Anthropic API (blog autopilot) — typically **~$40–$90/day** at current volume  

---

## 3. What is live today (inventory)

| Asset | Count |
|-------|-------|
| Enriched priority city pages | **54** |
| Priority state hub pages | **9** |
| Truck / rideshare / motorcycle variants | **24** |
| Total pre-built site pages (build) | **381** |
| Cities in content database | **226+** |
| New blog posts per day (autopilot) | **~240** |
| Ongoing API/content cost (estimate) | **~$1,200–$2,700/month** |

Technical detail: see `content/DEPLOYMENT_REPORT_2026-05-22.md`.

---

## 4. If we hired a U.S.-based team instead

Below is a **fair market comparison** for delivering **equivalent scope** with employees or agencies in the United States (not offshore). Figures are **all-in estimates** for strategy, legal-sensitive copy, engineering, QA, and project management.

### Scope equivalent to what we shipped

- Master city template + compliance/disclaimer framework  
- **54** full city guides (~1,500–2,500 words each, legal-adjacent, localized)  
- **9** state hub pages with internal linking  
- **24** accident-type variant pages  
- Next.js geo routing, JSON-LD, sitemap, mobile conversion UX  
- Blog program design for **~240 posts/day** across 226 cities (editorial plan + CMS + workflows)  
- 30/60/90 publishing strategy and internal linking playbook  

### Typical U.S. team composition

| Role | Time | Rate range (U.S.) |
|------|------|-------------------|
| SEO / growth lead | 3–4 months | $120k–$180k salary prorated, or $150–$250/hr agency |
| Legal marketing copywriters (2–3) | 4–6 months | $75–$150/hr; $800–$2,500 per long city page |
| Content ops / editor | 3–6 months | $60k–$90k prorated |
| Full-stack engineer(s) | 2–4 months | $140–$200/hr agency; $120k–$180k FTE prorated |
| QA + compliance review | 1–2 months | $50–$120/hr |
| Project / product management | 3–6 months | $100–$180/hr |

### Cost estimate (U.S. team)

| Approach | Estimated cost | Calendar time |
|----------|----------------|---------------|
| **Boutique SEO agency + freelancers** | **$180,000 – $350,000** | **4–7 months** |
| **In-house hire (4–6 FTEs)** | **$250,000 – $500,000** (salary + benefits, 6 mo.) | **5–9 months** to hire + build |
| **Large legal marketing agency** | **$400,000 – $800,000+** | **6–12 months** |

**Ongoing U.S. team run-rate (after launch):** roughly **$40,000 – $120,000/month** (editors, SEO, dev maintenance, compliance updates) to keep **240 posts/day** quality-controlled — or they would **reduce volume** and spend more per page.

### What we actually spent (this build)

| Item | Approximate cost |
|------|------------------|
| Engineering + automation (mostly AI-assisted, small team) | Already sunk in recent sprints |
| Vercel / hosting | Low hundreds $/month |
| Anthropic API (blog autopilot) | **~$1,200 – $2,700/month** at ~240 posts/day |
| **Ongoing incremental** vs. agency | **~95% less** than a U.S. agency for the same *page count* |

**Time to deploy this package:** **days to weeks** (iterative), vs. **4–9 months** for a comparable U.S. agency timeline.

---

## 5. Tradeoffs Kathy should know

| | Automated + registry system (what we did) | Traditional U.S. team |
|--|------------------------------------------|------------------------|
| **Speed** | Live now; expand city list in batches | Months to hire and produce |
| **Cost** | Low thousands $/mo API + hosting | Hundreds of thousands $ upfront |
| **Scale** | 240 posts/day feasible | Very expensive at same volume |
| **Risk** | Needs **sample QA** (legal tone, accuracy) | Higher human consistency per page |
| **Compliance** | Disclaimers baked in; still need periodic legal review | Easier to audit line-by-line |

**Recommendation:** Keep automation for **volume and speed**; assign a **lightweight U.S. review loop** (e.g., 5 pages/week + monthly legal glance) rather than replacing the system with a large writing staff.

---

## 6. Recommended next steps for leadership

1. **Approve 30-day metrics** — Search Console impressions, lead volume by source, API spend.  
2. **Legal/compliance** — 30-minute review of template + 3 sample cities (Texas + CA + NY).  
3. **Operations** — Confirm intake can handle rising form/call volume (855 WRECKMATCH).  
4. **Phase 2 budget** — Optional: part-time U.S. SEO consultant ($3k–$8k/mo) for strategy vs. $50k+/mo writing team.  
5. **Publishing** — Follow `content/PUBLISHING_SCHEDULE_30_60_90.md` (Texas first, then priority states, then long tail).

---

## 7. One-sentence summary for the board

**We replaced a six-figure, multi-month U.S. content and engineering project with a live, automated national SEO and lead-generation system on wreckmatch.com — designed to compound toward hundreds of leads per day while spending a few thousand dollars a month on AI and hosting instead of a large editorial department.**

---

*Questions or board-ready slides: request from the team that deployed commit `e7f3b01`.*
