#!/usr/bin/env python3
"""One-time / repeatable fixes for content/blog/*.md autopilot posts."""
from __future__ import annotations

import re
from pathlib import Path

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
        deadline = f"{ylabel} deadlines (verify with counsel)"
    return (
        f"{lead}, {state}? {deadline}, insurer tactics, and free attorney matching "
        f"in ~60 seconds via WreckMatch."
    )


def sol_phrase(state: str) -> str:
    years = STATE_SOL_YEARS.get(state, 2)
    if years == 1:
        return "**1 year** (many injury claims — confirm with licensed counsel)"
    return f"**{years} years** (most injury claims — confirm with licensed counsel)"


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

    state_m = re.search(r'^state:\s*"?([^"\n]+)"?\s*$', fm, re.M)
    state = (state_m.group(1).strip() if state_m else "") or ""
    city, state_from_slug = slug_city_state(slug)
    if not state and state_from_slug:
        state = state_from_slug
        fm = re.sub(r"^state:.*$", f'state: "{state}"', fm, flags=re.M)
        changes.append("state")

    if "Texas-style" in text:
        new_excerpt = excerpt_for(slug, city or "your area", state or "your state")
        if re.search(r"^excerpt:", fm, re.M):
            fm = re.sub(
                r'^excerpt:.*$',
                f'excerpt: "{new_excerpt}"',
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
