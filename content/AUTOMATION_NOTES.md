# WreckMatch Geo Automation Notes (May 2026)

## What exists today

| System | Path | Role |
|--------|------|------|
| Geo registry + enriched content | `lib/priority-places/` | Powers live `/car-accident-help-[place]` pages |
| Texas hand-tuned content | `lib/texas-city-content.ts` | Merged into enriched map |
| Blog traffic machine | `.github/workflows/wreckmatch-traffic-machine.yml` | ~240 LLM blog posts/day |
| Markdown export | `npm run export:geo` | Writes `content/geo-pages/*.md` for review |
| LLM draft script | `scripts/generate-content.mjs` | OpenAI drafts to `content/geo-drafts/` |

## Recommended bulk workflow

1. **Add city** to `lib/priority-places/registry.ts` (or extend Texas overrides).
2. **Add profile** to `lib/cities.ts` if not already present (for sitemap + static params).
3. Run `npm run export:geo` → review markdown in `content/geo-pages/`.
4. Deploy to Vercel (`main` on `injuredhelp.ai` repo).
5. Submit updated sitemap in Google Search Console.

## Future script ideas

```bash
# Export all priority pages to markdown (no API key)
npm run export:geo

# Generate one LLM draft for human review
OPENAI_API_KEY=... npm run generate:geo -- "Garland" "Texas"

# Batch enqueue cities not yet in registry (pseudo)
node scripts/enqueue-geo-batch.mjs --state Texas --limit 20
```

### `enqueue-geo-batch.mjs` (suggested)

- Read `lib/cities.ts` via AST or JSON export
- Diff against `lib/priority-places/registry.ts`
- Append rows to `content/autopilot/geo_queue.json`
- GitHub Action runs Claude to fill `content/geo-drafts/` then human or auto-merge into registry

## Deployment

- **Production:** `scotttischler-byte/injuredhelp-ai` → Vercel → www.wreckmatch.com
- Geo routes: `app/car-accident-help/[place]/page.tsx`
- Variants: `app/car-accident-help/[place]/[variant]/page.tsx`

## Secrets

- `ANTHROPIC_API_KEY` — blog autopilot
- `CRON_SECRET` — Vercel cron routes
- No API key required for static enriched pages (registry-driven)

## Cost control

- **Registry-driven pages:** $0 marginal cost, instant deploy
- **LLM blog:** budget ~$40–90/day at ~240 posts (monitor Anthropic usage)
- Prefer registry enrichment for top 100 metros; use blog for long-tail only
