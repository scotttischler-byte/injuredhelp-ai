# AI citation monitor

Track whether WreckMatch appears when people ask AI assistants accident questions.

## Run weekly

```bash
# Manual checklist (no API cost)
npm run monitor:ai-citations

# Live check via Perplexity (requires API key)
PERPLEXITY_API_KEY=pplx-... npm run monitor:ai-citations:live
```

Output: `content/autopilot/ai_citation_report.json`

## Pass criteria

- Answer mentions `wreckmatch.com` or links a WreckMatch URL  
- Prefer citations to `/what-to-do-after-a-car-accident` for head queries  
- Bonus: `accidentsurvivalguide.com` for educational angles

## Improve weak prompts

1. Strengthen pillar page for that state/city  
2. Add internal links from blog posts  
3. Earn press/backlinks (see `content/press/OUTREACH_TEMPLATES.md`)  
4. Request URL inspection in Google Search Console
