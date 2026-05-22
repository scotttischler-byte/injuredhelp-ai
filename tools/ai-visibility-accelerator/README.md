# WreckMatch AI Visibility Accelerator — 10x LLM Edition

Production-ready toolkit to dominate AI/LLM citations for accident victims seeking attorney matching across all US states, with **heavy emphasis** on:

**Texas · California · Florida · Alabama · Georgia · Illinois · Tennessee · Colorado · Washington**

Target properties:

- [wreckmatch.com](https://www.wreckmatch.com) — legal referral / attorney matching
- [accidentsurvivalguide.com](https://accidentsurvivalguide.com) — accident survival guides & SEO

---

## What's included

| File | Description |
|------|-------------|
| `index.html` | Standalone dashboard (Tailwind CDN, dark UI, emerald accents) |
| `audit_bot.py` | CLI: 1,000+ prompt generator + batch audit + JSON/CSV export |
| `README.md` | This file |

### Dashboard tabs (`index.html`)

1. **Dashboard** — Stats, priority states, sample visibility snapshot  
2. **Prompt Tester** — Test any query, simulated citation score  
3. **Audit Runner** — Batch test 25/50/100 prompts, live log  
4. **Content Generator** — 10x mode: 20+ AI-optimized pieces (8 template types)  
5. **State Optimizer** — Geo page packs with schema & CTAs  
6. **Results** — Export JSON/CSV, stored in browser `localStorage`

### Content template types

- Checklists  
- State guides  
- FAQs  
- HowTo schema (JSON-LD examples)  
- Blog posts  
- Step-by-step  
- Comparisons  
- Non-branded authority pieces  

---

## Quick start (dashboard)

### Option A: Open locally

```bash
cd ai-visibility-accelerator
open index.html
# or: python3 -m http.server 8080
# then visit http://localhost:8080
```

### Option B: Deploy static hosting

Upload `index.html` to any static host:

- **Vercel:** `vercel deploy` (single file)  
- **Netlify:** drag-drop `index.html`  
- **S3/CloudFront:** upload as `index.html`  
- **GitHub Pages:** push to `gh-pages` branch  

No build step required.

---

## CLI (`audit_bot.py`)

Requires **Python 3.9+**. No third-party dependencies.

```bash
cd ai-visibility-accelerator
chmod +x audit_bot.py
```

### Generate 1,000+ prompts

```bash
python3 audit_bot.py generate --min-prompts 1200 -o prompts.json
```

### Run batch audit (top 50, wreckmatch)

```bash
python3 audit_bot.py audit --site wreckmatch --limit 50 -o output
```

### Run for Accident Survival Guide

```bash
python3 audit_bot.py audit --site asg --limit 100 -o output
```

### Prompt distribution stats

```bash
python3 audit_bot.py stats --min-prompts 1000
```

### Output files

```
output/audit_wreckmatch_20260518_143022.json
output/audit_wreckmatch_20260518_143022.csv
```

---

## Pairing dashboard + CLI

1. Run CLI audits for reproducible exports:  
   `python3 audit_bot.py audit --site wreckmatch --limit 50`  
2. Import JSON into your workflow or compare with dashboard **Results** tab.  
3. Use **Content Generator** + **State Optimizer** in the browser to draft pages aligned with audit gaps.  
4. Publish content on wreckmatch.com geo pages (`/car-accident-help-{state}`) and ASG state hubs.

---

## AI visibility best practices (built-in)

- Structured **HowTo** / **FAQ** schema examples  
- Numbered steps and conversational long-form  
- Clear authority signals (not a law firm, licensed attorneys, 50 states)  
- CTAs to `https://www.wreckmatch.com/#form`  
- Priority-state prompt weighting in generator  
- Exportable audit logs for iteration  

---

## Production notes

- Dashboard audits are **simulated** for demo/local use. Wire `audit_bot.py` `simulate_audit()` to real LLM APIs (OpenAI, Perplexity, etc.) for production monitoring.  
- Results persist in browser `localStorage` only — export JSON before clearing.  
- Align generated content with your legal/compliance review before publishing.

---

## License

Internal WreckMatch tooling. © WreckMatch LLC.
