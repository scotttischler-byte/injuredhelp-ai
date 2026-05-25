# Blog quality standard — 100/100 target

Every post at https://www.wreckmatch.com/blog must pass **compliance**, **accuracy**, **E-E-A-T**, and **depth** before publish.

## Automated score (0–100)

| Check | Points lost if failed |
|-------|------------------------|
| Broken YAML frontmatter | Fail (block publish) |
| "Texas-style" outside Texas | −40 |
| Missing educational disclaimer | −25 |
| Missing 800+ network / referral-not-law-firm | −15 |
| Body &lt; 500 words (markdown) | −20 |
| Excerpt missing state or &lt; 40 chars | −10 |
| Wrongful-death post says "truck" in step 1 (template bug) | −15 |
| No internal link to CTA or wreckmatch.com | −10 |

**Publish threshold:** ≥ **85** (template + render expander).  
**Gold tier:** ≥ **95** + Claude-authored body ≥ **1,100** words.

## Voice & bylines (E-E-A-T)

| Topic | Author | Reviewer |
|-------|--------|----------|
| Wrongful death, catastrophic, severe injury, TBI, spinal | **Kathy Carr** | **Judge Roy Waddell** |
| Truck / FMCSA / 18-wheeler | **Scott Tischler** | **Judge Roy Waddell** |
| Insurance, statute, legal procedure | **Scott Tischler** | **Judge Roy Waddell** |
| First steps, whiplash recovery | **Kathy Carr** | optional |

Rendered page adds **2,000+ words** via `expandPostContent()` — source markdown should still read well alone (≥900 words target).

## Compliance (required phrases)

- Educational only; not legal advice  
- WreckMatch LLC is a legal referral service, **not a law firm**  
- No guaranteed outcomes / results  
- State statute described with "confirm with licensed counsel"  
- Phone + form CTA without pressure tactics  

## Beauty (UX)

- Cover: `/blog/covers/generated/{slug}.svg` (no remote stock)  
- Author portraits + LinkedIn in byline  
- Prose spacing via site `prose` + expanded sections  
- Related resources footer with geo + national guides  

## How we hit 100/100 on all posts

1. **New posts:** GitHub traffic machine runs `--ai --claude-first` (Claude Sonnet) with quality gate; falls back to premium template only if API unavailable.  
2. **Existing posts:** `npm run audit:blog` → `python3 scripts/upgrade_blogs_claude.py --limit N` for scores &lt; 85.  
3. **Never regress:** `npm run gate:blog` in CI blocks bad markdown.

## What is not junk

Indexed, citable content = unique URL + correct geo + compliance + long rendered HTML + real author graph.  
**Junk** = thin duplicate, wrong state, no disclaimer, no author — we block that at the gate.
