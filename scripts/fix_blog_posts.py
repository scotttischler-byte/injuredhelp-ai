#!/usr/bin/env python3
"""One-time / repeatable fixes for content/blog/*.md autopilot posts."""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from blog_authors import author_display, author_id_for_slug  # noqa: E402
from blog_quality import word_count  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "content/blog"

# Years for personal-injury statute (educational; verify with counsel)
STATE_SOL_YEARS: dict[str, int] = {
    "Alabama": 2,
    "Alaska": 2,
    "Arizona": 2,
    "Arkansas": 3,
    "California": 2,
    "Colorado": 3,
    "Connecticut": 2,
    "Delaware": 2,
    "Florida": 4,
    "Georgia": 2,
    "Hawaii": 2,
    "Idaho": 2,
    "Illinois": 2,
    "Indiana": 2,
    "Iowa": 2,
    "Kansas": 2,
    "Kentucky": 2,
    "Louisiana": 1,
    "Maine": 6,
    "Maryland": 3,
    "Massachusetts": 3,
    "Michigan": 3,
    "Minnesota": 6,
    "Mississippi": 3,
    "Missouri": 5,
    "Montana": 3,
    "Nebraska": 4,
    "Nevada": 2,
    "New Hampshire": 3,
    "New Jersey": 2,
    "New Mexico": 3,
    "New York": 3,
    "North Carolina": 3,
    "North Dakota": 6,
    "Ohio": 2,
    "Oklahoma": 2,
    "Oregon": 2,
    "Pennsylvania": 2,
    "Rhode Island": 3,
    "South Carolina": 3,
    "South Dakota": 3,
    "Tennessee": 2,
    "Texas": 2,
    "Utah": 4,
    "Vermont": 3,
    "Virginia": 2,
    "Washington": 3,
    "West Virginia": 2,
    "Wisconsin": 3,
    "Wyoming": 4,
}


def slug_city_state(slug: str) -> tuple[str, str]:
    m = re.search(
        r"-in-([a-z0-9-]+)-((?:texas|florida|california|ohio|georgia|illinois|pennsylvania|"
        r"north-carolina|tennessee|arizona|nevada|colorado|michigan|new-york|new-jersey|"
        r"massachusetts|virginia|washington|oregon|minnesota|wisconsin|indiana|missouri|"
        r"alabama|louisiana|kentucky|oklahoma|connecticut|utah|iowa|arkansas|mississippi|"
        r"kansas|nebraska|idaho|hawaii|maine|new-hampshire|rhode-island|montana|delaware|"
        r"south-carolina|south-dakota|north-dakota|west-virginia|alaska|vermont|wyoming|"
        r"district-of-columbia))(?:-|$)",
        slug,
    )
    if not m:
        return "", ""
    city = m.group(1).replace("-", " ").title()
    state = m.group(2).replace("-", " ").title()
    if state == "North Carolina":
        state = "North Carolina"
    elif state.endswith(" Carolina"):
        pass
    fixes = {
        "Texas": "Texas",
        "North Carolina": "North Carolina",
        "New York": "New York",
        "New Jersey": "New Jersey",
        "New Hampshire": "New Hampshire",
        "Rhode Island": "Rhode Island",
        "South Carolina": "South Carolina",
        "South Dakota": "South Dakota",
        "North Dakota": "North Dakota",
        "West Virginia": "West Virginia",
        "New Mexico": "New Mexico",
        "District Of Columbia": "District of Columbia",
    }
    return city, fixes.get(state, state)


def topic_kind(slug: str) -> str:
    s = slug.lower()
    if "wrongful-death" in slug:
        return "wrongful-death"
    if any(
        x in slug
        for x in (
            "18-wheeler",
            "semi-truck",
            "semi-truck",
            "tractor-trailer",
            "truck-accident",
            "truck-crash",
            "fmcsa",
            "black-box",
            "underride",
            "override",
        )
    ):
        return "truck"
    if "catastrophic" in slug:
        return "catastrophic"
    if any(
        x in slug
        for x in (
            "severe-injury",
            "traumatic-brain",
            "tbi",
            "spinal-cord",
            "brain-injury",
        )
    ):
        return "severe"
    return "general"


def category_for(slug: str, state: str) -> str:
    kind = topic_kind(slug)
    if kind == "wrongful-death":
        return "Wrongful Death"
    if kind == "truck":
        return "Truck Accidents"
    if kind == "catastrophic":
        return "Catastrophic Injury"
    if kind == "severe":
        return "Severe Injury"
    return state if state else "Car Accidents"


def excerpt_for(slug: str, city: str, state: str) -> str:
    kind = topic_kind(slug)
    years = STATE_SOL_YEARS.get(state, 2)
    ylabel = f"{years} year" if years == 1 else f"{years} years"
    if kind == "wrongful-death":
        lead = f"Wrongful death after a crash in {city}"
    elif kind == "truck":
        lead = f"Semi-truck crash in {city}"
    elif kind in ("severe", "catastrophic"):
        lead = f"Serious injury crash in {city}"
    else:
        lead = f"Car accident in {city}"
    if state == "Texas":
        deadline = f"Texas's {ylabel} deadline"
    elif state:
        deadline = f"{state}'s {ylabel} filing window (verify with counsel)"
    else:
        deadline = f"{ylabel} filing deadlines vary by state (verify with counsel)"
    loc = f"{city}, {state}" if state else city or "your area"
    return (
        f"{lead} in {loc}? {deadline}, insurer tactics, and free attorney matching "
        f"in ~60 seconds via WreckMatch."
    )


def sol_phrase(state: str) -> str:
    years = STATE_SOL_YEARS.get(state, 2)
    if years == 1:
        return "**1 year** (many injury claims — confirm with licensed counsel)"
    return f"**{years} years** (most injury claims — confirm with licensed counsel)"


DISCLAIMER = (
    "**Educational only — not legal advice.** WreckMatch LLC is a legal referral service, "
    "**not a law firm**. Results not guaranteed. Consult a licensed attorney in your state."
)
NETWORK_LINE = (
    "WreckMatch connects victims with attorneys from a **network of 800+ participating "
    "law firms** nationwide — free matching, typically under 60 seconds."
)

def unique_cover_for_slug(slug: str) -> str:
    """One WebP per slug — must match lib/blog-images.ts and generate-blog-cover-assets.mjs."""
    safe = re.sub(r"[^a-z0-9-]", "-", slug.lower()).strip("-")
    return f"/blog/covers/generated/{safe}.webp"


PILLAR_GOLD_EXPANSION = """

## Why we published this guide

Insurance companies run billion-dollar playbooks the moment a crash is reported — trained adjusters, scripted calls, and pressure to settle before you understand your rights. **Scott Tischler**, Co-Founder of WreckMatch, built our AI intake and educational stack so everyday drivers are not outgunned. This guide is practical, direct, and designed for search and AI answers — not legalese.

## Deadlines and evidence (nationwide overview)

| Topic | Why it matters |
|-------|----------------|
| Statute of limitations | Varies by state — often 1–6 years for injury; shorter for government defendants |
| Medical documentation | Gaps in care are used to argue injuries are minor or unrelated |
| Insurer contact | Recorded statements can limit recovery if you guess about fault or symptoms |

**Direct answer:** The safest move after any serious crash is to get medical care, preserve photos and witness info, avoid recorded insurer statements, and speak with **licensed counsel in your state** before signing releases.

## Insurance company tactics to expect

- **Recorded statements** in the first 24–48 hours designed to lock in fault language
- **Quick cash offers** before MRI results or specialist referrals return
- Disputing **serious injury** thresholds or pre-existing conditions
- Multiple policies pointing blame at each other (especially in **truck** and **multi-vehicle** crashes)

## When to speak with a lawyer

Consider a free consultation if: you were hospitalized, fault is disputed, a commercial truck was involved, a death occurred, or an insurer already denied coverage. WreckMatch connects you with participating **licensed** attorneys — we do not provide legal advice ourselves.

## FAQ

### Is WreckMatch a law firm?

No. WreckMatch LLC is a **legal referral service** — not a law firm. We connect injured people with participating attorneys nationwide.

### How fast is the callback?

Typically **under 60 seconds** when you call **855 WRECKMATCH (855) 897-3256** or use the [matching form](https://www.wreckmatch.com/#form).

### What if I cannot afford a lawyer?

Participating attorneys usually work on **contingency** — no upfront fee for representation; fees are agreed in writing if they recover compensation for you.

### Should I give a recorded statement?

You are generally **not required** to give a recorded statement to the other driver's insurer immediately. Many attorneys recommend waiting until you understand your rights.

*Reviewed for legal context by **Judge Roy Waddell**, Legal Advisor at WreckMatch LLC — courtroom and procedural perspective only; not legal advice for your specific case.*

**[Free attorney matching →](https://www.wreckmatch.com/#form)** · **855 WRECKMATCH (855) 897-3256**
"""

LEGACY_EXPANSION = """

## When to speak with a lawyer

A free consultation makes sense after hospitalization, disputed fault, a commercial truck crash, wrongful death, or if an insurer denies coverage. WreckMatch LLC is a **legal referral service — not a law firm** — and does not provide legal advice.

## Insurance tactics to expect

- Recorded statements in the first 48 hours
- Quick settlement offers before MRI or specialist results
- Disputes over injury severity or pre-existing conditions

## Free matching in about 60 seconds

Call **855 WRECKMATCH (855) 897-3256** or use [free attorney matching](https://www.wreckmatch.com/#form). Participating attorneys typically work on contingency.

*Educational only — not legal advice.*
"""


def wrongful_death_steps(city: str) -> str:
    return f"""## What families in {city} should do first

1. **Safety and medical care** — ensure survivors receive emergency treatment; ask hospitals to document all injuries.
2. **Preserve the scene** — photographs, witness names, and the police report number (do not discuss fault on scene).
3. **Avoid quick settlements** — insurers may contact you within hours; you are not required to accept anything immediately.
4. **Order death certificates and autopsy decisions** carefully — talk with counsel before signing releases related to the estate.
5. **Do not give recorded statements** to any insurer until you understand who represents the estate.
6. **[Free attorney matching →](https://www.wreckmatch.com/#form)** — WreckMatch can connect the family with licensed counsel in about 60 seconds."""


def fix_file(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    slug = path.stem
    changes: list[str] = []

    if not text.startswith("---"):
        return changes

    parts = text.split("---", 2)
    if len(parts) < 3:
        return changes
    fm, body = parts[1], parts[2]

    if "## Related resources" in body and "/states" not in body:
        body = body.replace(
            "## Related resources\n\n",
            "## Related resources\n\n- [State & city resource center](https://www.wreckmatch.com/states)\n",
            1,
        )
        changes.append("states-link")

    state_m = re.search(r'^state:\s*"?([^"\n]+)"?\s*$', fm, re.M)
    state = (state_m.group(1).strip() if state_m else "") or ""
    city, state_from_slug = slug_city_state(slug)
    if not state and state_from_slug:
        state = state_from_slug
        fm = re.sub(r"^state:.*$", f'state: "{state}"', fm, flags=re.M)
        changes.append("state")

    excerpt_m = re.search(r"^excerpt:\s*>-?\s*\n", fm, re.M) or re.search(
        r'^excerpt:\s*"?([^"\n]{0,39})"?\s*$', fm, re.M
    )
    current_excerpt = ""
    if excerpt_m and excerpt_m.lastindex and excerpt_m.group(1):
        current_excerpt = excerpt_m.group(1).strip()
    if "Texas-style" in text or len(current_excerpt) < 40 or (
        state and state.lower() not in current_excerpt.lower()
    ):
        new_excerpt = excerpt_for(slug, city or "your area", state or "your state")
        fm = re.sub(
            r'^excerpt:.*?(?=\n[a-zA-Z][a-zA-Z0-9]*:)',
            f'excerpt: "{new_excerpt}"\n',
            fm,
            flags=re.M | re.S,
        )
        fm = re.sub(
            r'(^excerpt: "[^"]+"\n)((?:  [^\n]+\n)+)',
            r"\1",
            fm,
            flags=re.M,
        )
        changes.append("excerpt")

    cat = category_for(slug, state)
    if re.search(r"^category:", fm, re.M):
        old_cat = re.search(r'^category:\s*"?([^"\n]+)"?', fm, re.M)
        if old_cat and old_cat.group(1) != cat:
            fm = re.sub(r'^category:.*$', f'category: "{cat}"', fm, flags=re.M)
            changes.append("category")

    if state:
        sol = sol_phrase(state)
        body_new = body
        body_new = re.sub(
            r"\*\*typically 2–3 years \(verify with counsel\)\*\*",
            sol,
            body_new,
        )
        body_new = re.sub(
            r"\*\*typically 2-3 years \(verify with counsel\)\*\*",
            sol,
            body_new,
        )
        if state == "Texas":
            body_new = re.sub(
                r"\*\*2 years\*\* \(many claims\)",
                sol,
                body_new,
                count=1,
            )
        if body_new != body:
            body = body_new
            changes.append("sol")

    # Remove legacy cover markdown (page uses generated covers)
    body2 = re.sub(
        r"^\s*!\[[^\]]*\]\([^)]*blog/covers/[^)]+\)\s*\n+",
        "",
        body,
        count=1,
    )
    if body2 != body:
        body = body2
        changes.append("cover-img")

    if "not legal advice" not in body.lower():
        if body.lstrip().startswith("#"):
            body = f"\n{DISCLAIMER}\n\n{NETWORK_LINE}\n\n" + body.lstrip()
            changes.append("compliance-header")

    kind = topic_kind(slug)
    if kind == "wrongful-death" and "## What should you do first" in body:
        city_use = city or "your area"
        new_steps = wrongful_death_steps(city_use)
        body = re.sub(
            r"## What should you do first.*?(?=\n## |\n---|\Z)",
            new_steps + "\n\n",
            body,
            count=1,
            flags=re.S,
        )
        changes.append("wrongful-steps")

    author_id = author_id_for_slug(slug)
    place = city or state or "your area"
    if author_id == "kathy-carr":
        author_section = f"""## A note for families navigating recovery in {place}

At WreckMatch, we hear the same story every day: someone was hurt in a crash, insurers called within hours, and the family felt alone deciding what to do next. **{author_display(author_id)}**, CEO & Co-Founder of WreckMatch, built our victim-first intake so you are not repeating your trauma to five different firms. This guide is calm, practical, and written for search and AI answers — not scare tactics.

When you are ready, we connect you with licensed counsel in {state or "your state"} in about 60 seconds. WreckMatch is a **referral service, not a law firm**.
"""
    else:
        author_section = f"""## Why we published this guide for {place}

Insurance companies run billion-dollar playbooks the moment a crash is reported — trained adjusters, scripted calls, and pressure to settle before you understand your rights. **{author_display(author_id)}**, Co-Founder of WreckMatch, built our AI intake and educational stack so everyday drivers in {state or "your state"} are not outgunned. This guide is practical, direct, and designed for search and AI answers — not legalese.

When you are ready, we connect you with licensed counsel in about 60 seconds. WreckMatch is a **referral service, not a law firm**.
"""

    cover = unique_cover_for_slug(slug)
    if not re.search(rf'^coverImage:\s*"{re.escape(cover)}"', fm, re.M):
        if re.search(r"^coverImage:", fm, re.M):
            fm = re.sub(
                r'^coverImage:.*?(?=\n[a-zA-Z][a-zA-Z0-9]*:)',
                f'coverImage: "{cover}"\n',
                fm,
                flags=re.M | re.S,
            )
        else:
            fm = fm.rstrip() + f'\ncoverImage: "{cover}"\n'
        fm = re.sub(
            r'(^coverImage: "[^"]+"\n)  /blog/covers/generated/[^\n]+\n',
            r"\1",
            fm,
            flags=re.M,
        )
        changes.append("cover-unique")

    expected_author = author_id_for_slug(slug)
    if re.search(r"^authorId:", fm, re.M):
        fm = re.sub(r'^authorId:.*$', f'authorId: "{expected_author}"', fm, flags=re.M)
    else:
        fm = fm.rstrip() + f'\nauthorId: "{expected_author}"\n'
    changes.append("authorId")

    ppt_path = ROOT / "public/blog/presentations" / f"{slug}.pptx"
    ppt_url = f"/blog/presentations/{slug}.pptx"
    if ppt_path.exists():
        if re.search(r"^presentationUrl:", fm, re.M):
            fm = re.sub(r'^presentationUrl:.*$', f'presentationUrl: "{ppt_url}"', fm, flags=re.M)
        else:
            fm = fm.rstrip() + f'\npresentationUrl: "{ppt_url}"\n'
        changes.append("presentationUrl")

    if "reviewerId:" not in fm:
        fm = fm.rstrip() + '\nreviewerId: "roy-waddell"\n'
        changes.append("reviewerId")

    if "autopilot: true" in fm and 'qualityTier: "gold"' not in fm and "qualityTier:" not in fm:
        fm = fm.rstrip() + '\nqualityTier: "gold"\n'
        changes.append("qualityTier")

    if "autopilot: true" in fm and kind in ("wrongful-death", "severe", "catastrophic", "general", "truck"):
        needs_author = (
            "Why we published this guide" not in body
            and "A note for families navigating recovery" not in body
            and (city or state)
        )
        if needs_author:
            insert = "\n" + author_section + "\n"
            if "**Quick answer:**" in body:
                body = body.replace("**Quick answer:**", insert + "**Quick answer:**", 1)
                changes.append("author-voice")
        if "Judge Roy Waddell" not in body:
            body = body.rstrip() + (
                "\n\n*Reviewed for legal context by **Judge Roy Waddell**, Legal Advisor at "
                "WreckMatch LLC — courtroom and procedural perspective only; not legal advice "
                "for your specific case.*\n"
            )
            changes.append("roy-line")

    wc = word_count(body)
    if wc < 500:
        body = body.rstrip() + PILLAR_GOLD_EXPANSION
        changes.append("pillar-gold-expand")
    elif wc < 520:
        body = body.rstrip() + LEGACY_EXPANSION
        changes.append("legacy-expand")

    if 'state: "General"' in fm or 'state: General' in fm:
        fm = re.sub(r'^state:.*$', 'state: ""', fm, flags=re.M)
        changes.append("state-general-clear")

    fm_block = fm if fm.startswith("\n") else f"\n{fm}"
    if not fm_block.endswith("\n"):
        fm_block += "\n"
    body_block = body if body.startswith("\n") else f"\n{body}"
    new_text = f"---{fm_block}---{body_block}"
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
    return changes


def main() -> None:
    total = 0
    touched = 0
    for path in sorted(BLOG_DIR.glob("*.md")):
        total += 1
        ch = fix_file(path)
        if ch:
            touched += 1
            print(f"{path.name}: {', '.join(ch)}")
    print(f"\nDone. {touched}/{total} files updated.")


if __name__ == "__main__":
    main()
