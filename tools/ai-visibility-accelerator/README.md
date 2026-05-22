# WreckMatch AI Visibility Accelerator — 10x LLM Domination Edition (May 2026)

Ultimate internal tool to flood AI engines with highly citable WreckMatch and Accident Survival Guide content across all US states.

**Live:** https://www.wreckmatch.com/ai-visibility-accelerator

**Priority states:** Texas, California, Florida, Alabama, Georgia, Illinois, Tennessee, Colorado, Washington

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Single-file dashboard (7 tabs, 5000+ prompts in-browser) |
| `audit_bot.py` | CLI — 5,000+ prompts, audits, Texas samples, 51 state posts |
| `build_index.py` | Regenerates `index.html` from template |
| `output/content/` | Generated Texas samples + per-state markdown posts |

---

## Dashboard tabs

1. **Dashboard** — Texas score, progress bars, quick actions, **Generate 50 Texas Pieces**
2. **Prompt Tester** — Simulate LLM citation likelihood
3. **Massive State Audit** — Batch 50/100/250/500 prompts (Texas-first)
4. **10x Content Factory** — Guides, checklists, mistakes, SOL, insurance, FAQ + JSON-LD
5. **State Page Builder** — URL slug, meta, H1, schema, internal links
6. **Prompt Library** — Searchable 5000+ prompts with filters
7. **Export Center** — Copy MD, Copy HTML+schema, Download .md / .json / .csv

---

## CLI

```bash
cd ai-visibility-accelerator

# Prompt library stats (13,000+ with default min)
python3 audit_bot.py stats --min-prompts 5000

# Export prompts JSON
python3 audit_bot.py generate --min-prompts 5000 -o prompts.json

# Mock audit (Texas filter)
python3 audit_bot.py audit --site wreckmatch --state Texas --limit 50

# Generate 5 Texas samples + 1 post per state (51 files)
python3 audit_bot.py content -o output/content

# Rebuild dashboard HTML
python3 build_index.py
```

---

## Deploy to production

Copy to `injuredhelp.ai`:

```bash
cp index.html /path/to/injuredhelp.ai/public/ai-visibility-accelerator/
cp audit_bot.py README.md /path/to/injuredhelp.ai/tools/ai-visibility-accelerator/
```

Then commit and push `main` on injuredhelp.ai (Vercel deploys wreckmatch.com).

---

## Content types (10x Factory)

- Comprehensive state guides (2026)
- Step-by-step checklists
- Common mistakes + avoidance
- Statute of limitations per state
- Insurance adjuster tactics
- FAQ with FAQPage JSON-LD
- HowTo schema
- Lawyer vs DIY comparison tables

All pieces include educational disclaimers and CTA → `https://www.wreckmatch.com/#form`

---

Internal WreckMatch LLC tooling · May 2026
