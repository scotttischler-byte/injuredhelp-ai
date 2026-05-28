#!/usr/bin/env python3
"""
WreckMatch Traffic Machine — 24/7/365 blog + social syndication
==============================================================
Focus: car accidents, semi/truck crashes, severe & catastrophic injuries.
Publishes to content/blog/*.md + content/syndication/ for X/LinkedIn/Reddit.

Usage:
  python scripts/wreckmatch_blog_autopilot.py --refill 500
  python scripts/wreckmatch_blog_autopilot.py --batch 2 --ai --syndicate
  python scripts/wreckmatch_blog_autopilot.py --claude-first

Environment:
  ANTHROPIC_API_KEY  preferred (Claude)
  OPENAI_API_KEY     fallback
  WRECKMATCH_SITE    https://www.wreckmatch.com
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None  # type: ignore

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
from blog_quality import QualityReport, score_post  # noqa: E402

BLOG_DIR = ROOT / "content/blog"
SYNDICATION_DIR = ROOT / "content/syndication"
QUEUE_PATH = ROOT / "content/autopilot/blog_queue.json"
LOG_PATH = ROOT / "content/autopilot/blog_generation.log"
SITE = os.getenv("WRECKMATCH_SITE", "https://www.wreckmatch.com").rstrip("/")
CTA = f"{SITE}/#form"
PHONE = os.getenv("WRECKMATCH_PHONE_DISPLAY", "855 WRECKMATCH (855) 897-3256")

# Personal-injury SOL years (educational — victims must verify with counsel)
STATE_SOL_YEARS: dict[str, int] = {
    "Texas": 2,
    "Florida": 4,
    "California": 2,
    "Ohio": 2,
    "Georgia": 2,
    "Illinois": 2,
    "Pennsylvania": 2,
    "North Carolina": 3,
    "Tennessee": 2,
    "Arizona": 2,
    "Nevada": 2,
    "Colorado": 3,
    "Michigan": 3,
    "New York": 3,
    "Louisiana": 1,
    "Alabama": 2,
}

NETWORK_LINE = (
    "WreckMatch connects victims with attorneys from a **network of 800+ participating "
    "law firms** nationwide — free matching, typically under 60 seconds."
)

DISCLAIMER = (
    "**Educational only — not legal advice.** WreckMatch LLC is a legal referral service, "
    "**not a law firm**. Results not guaranteed. Consult a licensed attorney in your state."
)

TEXAS_METROS = [
    ("houston", "Houston"),
    ("san-antonio", "San Antonio"),
    ("dallas", "Dallas"),
    ("fort-worth", "Fort Worth"),
    ("austin", "Austin"),
    ("el-paso", "El Paso"),
    ("corpus-christi", "Corpus Christi"),
    ("plano", "Plano"),
    ("lubbock", "Lubbock"),
    ("arlington-texas", "Arlington"),
    ("irving", "Irving"),
]

# Priority 0 — high-intent organic traffic (truck + severe injury)
INJURY_ANGLES = [
    ("semi-truck-accident", "Semi Truck Accident in {city}, {state}: What to Do (2026)"),
    ("18-wheeler-crash", "18-Wheeler Crash in {city}, {state} — Victim Guide (2026)"),
    ("tractor-trailer-injury", "Tractor-Trailer Injury in {city}, {state}: Legal Steps (2026)"),
    ("severe-injury-car-accident", "Severe Injury After a Car Accident in {city}, {state} (2026)"),
    ("catastrophic-injury", "Catastrophic Injury Car Crash in {city}, {state} (2026)"),
    ("tbi-car-accident", "Traumatic Brain Injury (TBI) From a Car Accident in {city}, {state}"),
    ("spinal-cord-injury", "Spinal Cord Injury After a Crash in {city}, {state} (2026)"),
    ("wrongful-death-car", "Wrongful Death Car Accident in {city}, {state} — Family Guide"),
    ("commercial-truck-lawyer", "Do I Need a Truck Accident Lawyer in {city}, {state}? (2026)"),
    ("underride-override", "Underride or Override Truck Crash in {city}, {state} (2026)"),
    ("fmcsa-violation", "FMCSA Violations After a Truck Crash in {city}, {state}"),
    ("black-box-truck", "Black Box Data After a Semi Crash in {city}, {state}"),
]

STANDARD_ANGLES = [
    ("what-to-do-after", "What to Do After a Car Accident in {city}, {state} (2026)"),
    ("statute-of-limitations", "{state} Car Accident Statute of Limitations — {city} (2026)"),
    ("insurance-denied", "Insurance Denied Your Claim in {city}? ({state} 2026)"),
    ("common-mistakes", "7 Costly Car Accident Mistakes in {city}, {state} (2026)"),
    ("lawyer-vs-diy", "Should You Hire a Lawyer After a {city} Crash? ({state} 2026)"),
    ("whiplash", "Whiplash After a Car Accident in {city}, {state} — What to Know (2026)"),
    ("truck-accident", "Truck Accident in {city}, {state}: Steps & Legal Help (2026)"),
    ("rideshare", "Uber or Lyft Accident in {city}, {state} (2026 Guide)"),
    ("uninsured-driver", "Hit by an Uninsured Driver in {city}, {state} (2026)"),
    ("settlement-timeline", "How Long Does a Car Accident Settlement Take in {city}? (2026)"),
]

# States with active firm partners — queue sorts these first
FIRM_STATES = frozenset({
    "Texas",
    "Alabama",
    "Georgia",
    "Illinois",
    "Tennessee",
    "Florida",
    "Colorado",
    "Washington",
    "California",
})

CITIES_TS = ROOT / "lib" / "cities.ts"


def load_all_cities() -> list[tuple[str, str, str]]:
    """Parse ALL_CITIES from lib/cities.ts → (city, state, place_slug)."""
    if not CITIES_TS.exists():
        return [(city, "Texas", place) for place, city in TEXAS_METROS]

    text = CITIES_TS.read_text(encoding="utf-8")
    marker = "export const ALL_CITIES"
    if marker not in text:
        return [(city, "Texas", place) for place, city in TEXAS_METROS]

    body = text.split(marker, 1)[1]
    start = body.find("[")
    end = body.rfind("];")
    if start < 0 or end < 0:
        return [(city, "Texas", place) for place, city in TEXAS_METROS]

    array_body = body[start + 1 : end]
    cities: list[tuple[str, str, str]] = []
    for block in re.split(r"\n  \{", array_body):
        if '"city":' not in block:
            continue
        city_m = re.search(r'"city": "([^"]+)"', block)
        state_m = re.search(r'"state": "([^"]+)"', block)
        if not city_m or not state_m:
            continue
        city, state = city_m.group(1), state_m.group(1)
        place_m = re.search(r'"placeSlug": "([^"]+)"', block)
        place = place_m.group(1) if place_m else slugify(city)
        cities.append((city, state, place))

    log(f"Loaded {len(cities)} cities from {CITIES_TS.name}")
    return cities


def log(msg: str) -> None:
    line = f"[{datetime.now(timezone.utc).isoformat()}] {msg}"
    print(line)
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return re.sub(r"-+", "-", s)[:90]


def load_env() -> None:
    if load_dotenv:
        load_dotenv(ROOT / ".env.local")
        load_dotenv(ROOT / ".env")


def load_queue() -> dict[str, Any]:
    if QUEUE_PATH.exists():
        return json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    return {"version": 2, "completed_slugs": [], "stats": {"total_published": 0}, "pending": []}


def save_queue(q: dict[str, Any]) -> None:
    q["stats"]["last_run_at"] = datetime.now(timezone.utc).isoformat()
    QUEUE_PATH.write_text(json.dumps(q, indent=2) + "\n", encoding="utf-8")


def is_truck_topic(topic: dict[str, Any]) -> bool:
    a = topic.get("angle", "")
    return any(
        x in a
        for x in (
            "semi",
            "truck",
            "18-wheeler",
            "tractor",
            "fmcsa",
            "black-box",
            "underride",
            "commercial",
        )
    )


def is_severe_topic(topic: dict[str, Any]) -> bool:
    a = topic.get("angle", "")
    return any(
        x in a
        for x in ("severe", "catastrophic", "tbi", "spinal", "wrongful-death", "brain")
    )


def firm_priority(state: str, angle_slug: str) -> int:
    """Lower = published sooner. Firm states and truck/severe angles win."""
    in_firm = state in FIRM_STATES
    if angle_slug in {a for a, _ in INJURY_ANGLES}:
        return 0 if in_firm else 2
    return 1 if in_firm else 3


def build_topic_pool(limit: int = 0) -> list[dict[str, Any]]:
    topics: list[dict[str, Any]] = []
    all_cities = load_all_cities()

    def add(city: str, state: str, place: str, angle_slug: str, title_tpl: str) -> None:
        pri = firm_priority(state, angle_slug)
        topics.append({
            "angle": angle_slug,
            "title": title_tpl.format(city=city, state=state),
            "city": city,
            "state": state,
            "place_slug": place,
            "priority": pri,
            "firm_state": state in FIRM_STATES,
            "vertical": "truck" if "truck" in angle_slug or "semi" in angle_slug or "wheeler" in angle_slug else (
                "severe" if pri <= 2 and angle_slug not in ("semi-truck-accident", "18-wheeler-crash")
                and any(x in angle_slug for x in ("severe", "catastrophic", "tbi", "spinal", "wrongful"))
                else "auto"
            ),
        })

    for city, state, place in all_cities:
        for angle_slug, title_tpl in INJURY_ANGLES:
            add(city, state, place, angle_slug, title_tpl)
        # Standard city templates only in core firm states — quality over volume
        if state in FIRM_STATES:
            for angle_slug, title_tpl in STANDARD_ANGLES:
                add(city, state, place, angle_slug, title_tpl)

    nationals = [
        "Semi Truck Accident Victim Guide — Nationwide (2026)",
        "Severe Car Accident Injuries: When to Call a Lawyer (2026)",
        "18-Wheeler Crash: Black Box & FMCSA Evidence (2026)",
        "Catastrophic Injury After a Car Crash — Next Steps (2026)",
        "How WreckMatch Matches You With a Truck Accident Lawyer in 60 Seconds",
        "Car Accident vs Semi Truck Claim — Key Differences (2026)",
        "Traumatic Brain Injury From a Car Accident — What Families Should Know",
        "Wrongful Death Car Accident — State Deadlines Overview (2026)",
    ]
    for i, title in enumerate(nationals * 30):
        topics.append({
            "angle": "national-injury",
            "title": title if i == 0 else f"{title}",
            "city": "National",
            "state": "United States",
            "place_slug": None,
            "priority": 0 if i < len(nationals) else 1,
            "vertical": "truck" if "Semi" in title or "18-Wheeler" in title or "Truck" in title else "severe",
        })

    topics.sort(
        key=lambda t: (
            t["priority"],
            0 if t.get("vertical") == "truck" else 1,
            t["state"],
            t["city"],
            t["angle"],
        )
    )
    return topics[:limit] if limit > 0 else topics


def refill_queue(q: dict[str, Any], target: int) -> None:
    done = set(q.get("completed_slugs", []))
    existing = {slugify(t["title"]) for t in q.get("pending", [])}
    pool = build_topic_pool()
    added = 0
    for t in pool:
        slug = slugify(t["title"])
        if slug in done or slug in existing:
            continue
        t["slug"] = slug
        q.setdefault("pending", []).append(t)
        existing.add(slug)
        added += 1
        if added >= target:
            break
    log(f"Refilled queue: +{added} topics ({len(q['pending'])} pending)")


def sol_years(state: str) -> int:
    return STATE_SOL_YEARS.get(state, 2)


def sol_phrase(state: str) -> str:
    y = sol_years(state)
    if y == 1:
        return "**1 year** (many injury claims — confirm with licensed counsel)"
    return f"**{y} years** (most injury claims — confirm with licensed counsel)"


def excerpt_line(topic: dict[str, Any]) -> str:
    city, state = topic["city"], topic["state"]
    truck = is_truck_topic(topic)
    severe = is_severe_topic(topic)
    slug = topic.get("slug", slugify(topic["title"]))
    y = sol_years(state)
    year_label = f"{y} year" if y == 1 else f"{y} years"
    if "wrongful-death" in slug or "wrongful death" in topic["title"].lower():
        lead = f"Wrongful death after a crash in {city}"
    elif truck:
        lead = f"Semi-truck crash in {city}"
    elif severe:
        lead = f"Serious injury crash in {city}"
    else:
        lead = f"Car accident in {city}"
    if state == "Texas":
        deadline = f"Texas's {year_label} statute of limitations"
    else:
        deadline = f"{state}'s {year_label} filing window (verify with counsel)"
    return (
        f"{lead}, {state}? {deadline}, insurer tactics, and free attorney matching "
        f"in ~60 seconds via WreckMatch."
    )


def category_for_topic(topic: dict[str, Any]) -> str:
    slug = topic.get("slug", slugify(topic["title"]))
    state = topic["state"]
    if "wrongful-death" in slug or "wrongful death" in topic["title"].lower():
        return "Wrongful Death"
    if is_truck_topic(topic):
        return "Truck Accidents"
    if "catastrophic" in slug:
        return "Catastrophic Injury"
    if is_severe_topic(topic):
        return "Severe Injury"
    return state if state not in ("United States", "National") else "Car Accidents"


def hub_link(topic: dict[str, Any]) -> str:
    place = topic.get("place_slug")
    if place:
        return f"{SITE}/car-accident-help-{place}"
    return f"{SITE}/car-accident-help-{slugify(topic['state'])}"


def topic_kind_from_topic(topic: dict[str, Any]) -> str:
    slug = (topic.get("slug") or slugify(topic["title"])).lower()
    if "wrongful-death" in slug or "wrongful death" in topic["title"].lower():
        return "wrongful-death"
    if is_truck_topic(topic):
        return "truck"
    if "catastrophic" in slug:
        return "catastrophic"
    if is_severe_topic(topic):
        return "severe"
    return "general"


def first_steps_block(kind: str, city: str, truck: bool) -> str:
    if kind == "wrongful-death":
        return f"""## What families in {city} should do first

1. **Safety and medical care** — ensure survivors receive emergency treatment; ask hospitals to document all injuries.
2. **Preserve the scene** — photographs, witness names, and the police report number (do not discuss fault on scene).
3. **Avoid quick settlements** — insurers may contact you within hours; you are not required to accept anything immediately.
4. **Order death certificates and autopsy decisions** carefully — talk with counsel before signing releases related to the estate.
5. **Do not give recorded statements** to any insurer until you understand who represents the estate.
6. **[Free attorney matching →]({CTA})** — WreckMatch can connect the family with licensed counsel in about 60 seconds."""
    if truck:
        return f"""## What should you do first after a truck crash in {city}?

1. Call **911** — commercial crashes often need highway patrol, HAZMAT, and EMS.
2. Photograph **all units**, DOT numbers, plates, carrier logos, and road conditions.
3. Request **driver and carrier identification** (many defendants may exist).
4. Seek **trauma care** — internal injuries are common even when you feel “fine.”
5. **Do not** give a recorded statement to any insurer.
6. **[Get matched with a lawyer →]({CTA})**"""
    return f"""## What should you do first after a crash in {city}?

1. Call **911** if anyone is hurt or traffic is blocked.
2. Photograph vehicles, injuries visible from outside the car, and the full scene.
3. Exchange insurance and contact information; collect witness phone numbers.
4. Seek **medical care within 24 hours** — delays hurt both health and claims.
5. **Do not** give a recorded statement to the other driver's insurer.
6. **[Get matched with a lawyer →]({CTA})**"""


def scott_voice_block(kind: str, city: str, state: str) -> str:
    place = city or state or "your area"
    st = state or "your state"
    return f"""
## Why we published this guide for {place}

Insurance companies run billion-dollar playbooks the moment a crash is reported — trained adjusters, scripted calls, and pressure to settle before you understand your rights. **Scott Tischler**, Co-Founder of WreckMatch, built our AI intake and educational stack so everyday drivers in {st} are not outgunned. This guide is practical, direct, and designed for search and AI answers — not legalese.

When you are ready, we connect you with licensed counsel in about 60 seconds. WreckMatch is a **referral service, not a law firm**.
"""


def roy_review_block(_kind: str) -> str:
    return """
*Reviewed for legal context by **Judge Roy Waddell**, Legal Advisor at WreckMatch LLC — courtroom and procedural perspective only; not legal advice for your specific case.*
"""


def use_ai_retry() -> bool:
    return bool(os.getenv("ANTHROPIC_API_KEY", "").strip() or os.getenv("OPENAI_API_KEY", "").strip())


def template_post(topic: dict[str, Any]) -> str:
    city, state = topic["city"], topic["state"]
    title = topic["title"]
    hub = hub_link(topic)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    truck = is_truck_topic(topic)
    severe = is_severe_topic(topic)
    kind = topic_kind_from_topic(topic)

    sol = sol_phrase(state)
    extra = ""
    if truck:
        extra = """
## Semi truck & commercial vehicle specifics

| Evidence | Why it matters |
|----------|----------------|
| Black box (ECM) data | Speed, braking, hours-of-service |
| Driver logbooks / ELD | FMCSA violations |
| Cargo loading records | Shifted load liability |
| Carrier insurance limits | Often $750K–$1M+ |

**Direct answer:** Truck cases often involve **multiple defendants** (driver, motor carrier, broker, shipper). Your attorney may send **spoliation** letters immediately so electronic data is preserved.
"""
    if severe or kind == "wrongful-death":
        extra += """
## Severe injury & wrongful death considerations

- Document **lifetime care needs**, lost earnings, and future medical costs — not just today's ER bill.
- Do not accept lump-sum settlements before **maximum medical improvement (MMI)** without counsel.
- Life-care planners, economists, and medical illustrators may be appropriate in high-value cases.
- **Wrongful death** claims involve different beneficiaries, estates, and deadlines than personal injury alone.
"""

    category = category_for_topic(topic)
    excerpt = excerpt_line(topic)
    steps = first_steps_block(kind, city, truck)
    scott_note = scott_voice_block(kind, city, state)
    roy = roy_review_block(kind)
    crash_label = "semi truck or " if truck else ""
    quick_extra = " including ECM/black box and carrier IDs" if truck else ""

    return f"""---
title: "{title.replace('"', "'")}"
description: "Educational guide for {city} {('semi truck and ' if truck else '')}car accident victims in {state}. Deadlines, insurance tactics, and free attorney matching — 800+ law firm network. Not legal advice."
date: "{today}"
category: "{category}"
state: "{state if state not in ('United States', 'National') else ''}"
excerpt: "{excerpt}"
autopilot: true
vertical: "{topic.get('vertical', 'auto')}"
qualityTier: "gold"
authorId: "scott-tischler"
reviewerId: "roy-waddell"
---

# {title}

{DISCLAIMER}

**Last updated:** {today}

{NETWORK_LINE}

**Quick answer:** After a {crash_label}crash in {city}, {state}, call 911, get medical care, preserve evidence{quick_extra}, avoid recorded insurer statements, and use **[free attorney matching]({CTA})** before signing anything.

{scott_note}
{steps}
{extra}
## {state} deadlines & why timing matters

| Topic | Detail |
|-------|--------|
| Statute of limitations | {sol} |
| Government / special defendants | Often **much shorter** notice windows — ask counsel immediately |
| WreckMatch matching fee | **$0** to consumers |

Insurers track filing deadlines closely. Missing a notice period can end a claim even when injuries are catastrophic.

## Insurance company tactics to expect

- **Recorded statements** in the first 24–48 hours designed to lock in fault language
- **Quick cash offers** before MRI results or specialist referrals return
- Disputing **serious injury** thresholds or pre-existing conditions
- Multiple policies pointing blame at each other (especially in **truck** and **multi-vehicle** crashes)

## When to speak with a lawyer

Consider a free consultation if: hospitalization occurred, fault is disputed, a commercial truck was involved, a death occurred, or an insurer already denied coverage. WreckMatch connects you with participating **licensed** attorneys — we do not provide legal advice ourselves.

## FAQ

### Is WreckMatch a law firm?

No. WreckMatch LLC is a **legal referral service** — not a law firm. We connect injured people with participating attorneys who handle **car, truck, and catastrophic injury** cases in {state}.

### How fast is the callback?

Typically **under 60 seconds** when you call {PHONE} or use the [matching form]({CTA}).

### What if I cannot afford a lawyer?

Participating attorneys usually work on **contingency** — no upfront fee for representation; fees are agreed in writing if they recover compensation for you.

### Where is the local help hub?

**[{city} car accident help]({hub})** · [National what-to-do guide]({SITE}/what-to-do-after-a-car-accident)

{roy}

**[Free attorney matching →]({CTA})** · {PHONE}
"""


def call_claude_api(system: str, user: str, max_tokens: int = 2400) -> str | None:
    key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not key:
        return None
    payload = json.dumps(
        {
            "model": os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6"),
            "max_tokens": max_tokens,
            "system": system,
            "messages": [{"role": "user", "content": user}],
        }
    ).encode()
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        headers={
            "content-type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as res:
            data = json.loads(res.read().decode())
        parts = data.get("content", [])
        return "".join(p.get("text", "") for p in parts if p.get("type") == "text").strip()
    except Exception as e:
        log(f"Claude API error: {e}")
        return None


def generate_with_openai(topic: dict[str, Any]) -> str | None:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if not key:
        return None
    try:
        from openai import OpenAI
    except ImportError:
        return None
    hub = hub_link(topic)
    truck = is_truck_topic(topic)
    severe = is_severe_topic(topic)
    prompt = f"""Write markdown blog + YAML frontmatter for WreckMatch.com.

Title: {topic['title']}
City: {topic['city']}, State: {topic['state']}
Truck/semi focus: {truck}
Severe injury focus: {severe}
Hub: {hub}
CTA: {CTA}
Phone: {PHONE}
Mention: network of 800+ participating law firms (referral service, not a law firm)

Requirements:
- 2000-2400 words minimum, H2/H3 questions, tables, numbered lists
- Quotable first sentence per section (LLM citation 2026)
- FMCSA/black box if truck; MMI/life-care if severe
- category: Truck Accidents, Severe Injury, Wrongful Death, or Catastrophic Injury — match the topic
- excerpt: use the correct STATE deadline (never say Texas-style unless the state is Texas)
- frontmatter: title, description, date, category, state, excerpt, autopilot: true, vertical
"""
    try:
        client = OpenAI(api_key=key)
        resp = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": "Expert PI referral educational content. Not a law firm."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.65,
        )
        return (resp.choices[0].message.content or "").strip() + "\n"
    except Exception as e:
        log(f"OpenAI error: {e}")
        return None


SCOTT_VOICE = """Scott Tischler — Co-Founder & SVP Marketing at WreckMatch LLC. Former AmEx/MetLife/UBS
lead-program executive; built WreckMatch.com, MVA Match, AI intake (Ava), SEO/GEO strategy. Voice:
direct, strategic, empathetic but not soft — levels the playing field vs insurers. Quote tone:
"Insurance companies have billion-dollar systems… Most drivers are completely unprepared."
"""

KATHY_VOICE = """Kathy Carr — CEO & Co-Founder at WreckMatch LLC. Healthcare-informed, victim-first voice.
Empathetic and calm — families navigating recovery after crashes. Quote tone:
"We built WreckMatch so you are not repeating your trauma to five different intake coordinators."
"""


def author_id_for_topic(topic: dict[str, Any]) -> str:
    slug = (topic.get("slug") or "").lower()
    if not slug:
        slug = re.sub(r"[^a-z0-9]+", "-", (topic.get("title") or "").lower()).strip("-")
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from blog_authors import author_id_for_slug  # noqa: E402

    return author_id_for_slug(slug)


def ai_system_prompt(author_id: str = "scott-tischler") -> str:
    is_kathy = author_id == "kathy-carr"
    voice = KATHY_VOICE if is_kathy else SCOTT_VOICE
    author_section = (
        "## A note for families navigating recovery in [city]"
        if is_kathy
        else "## Why we published this guide for [city]"
    )
    return f"""You write A+ publication-ready educational articles for WreckMatch.com.

WreckMatch LLC is a legal REFERRAL SERVICE — NOT a law firm. Never guarantee outcomes.

AUTHOR (write AS this person — first person "we" for WreckMatch is OK):
{voice}

Include section "{author_section}" in the author's voice (2 short paragraphs).

REVIEWER: Judge Roy Waddell reviewed for legal context — end with one italic line crediting Roy
(Legal Advisor, educational only, not case-specific legal advice).

Compliance (mandatory): educational only; not legal advice; not a law firm; 800+ participating
law firms; confirm deadlines with licensed counsel; 855 WRECKMATCH phone + form CTA.

Quality bar (A+ / 100): 2,000–2,400 words markdown minimum, 5+ H2 sections, table, numbered steps, 4+ FAQs,
quotable first sentence per section, correct STATE statute years only (never Texas-style outside TX).
frontmatter qualityTier: gold and authorId: {author_id} reviewerId: roy-waddell."""


def generate_ai_post(topic: dict[str, Any], claude_first: bool) -> str:
    author_id = author_id_for_topic(topic)
    system = ai_system_prompt(author_id)
    hub = hub_link(topic)
    truck = is_truck_topic(topic)
    severe = is_severe_topic(topic)
    kind = topic_kind_from_topic(topic)
    y = sol_years(topic["state"])
    user = f"""Write full markdown article with YAML frontmatter for WreckMatch.com.

Title: {topic['title']}
Location: {topic['city']}, {topic['state']}
Topic kind: {kind}
Angle: {topic.get('angle')}
Truck/semi focus: {truck}
Severe injury focus: {severe}
Approximate statute of limitations: {y} years (say "verify with counsel")
City hub (link in article): {hub}
CTA: {CTA}
Phone: {PHONE}

Requirements:
- 2000-2400 words minimum; H2/H3 headings as questions where possible
- Start each major section with one quotable sentence (LLM citation 2026)
- Include at least one markdown table and numbered action steps
- FMCSA, black box, spoliation if truck; MMI and life-care if severe/wrongful death
- frontmatter: title, description, date, category, state, excerpt, autopilot: true, vertical, qualityTier: platinum, authorId: {author_id}, reviewerId: roy-waddell
- category must be one of: Truck Accidents, Severe Injury, Wrongful Death, Catastrophic Injury, or state name
- excerpt must mention {topic['state']} and {y}-year deadline — NEVER "Texas-style" unless state is Texas
- Wrongful death: family-focused steps, NOT generic truck DOT steps
"""
    if claude_first:
        body = call_claude_api(system, user)
        if body:
            return body + "\n"
        body = generate_with_openai(topic)
        if body:
            return body
    else:
        body = generate_with_openai(topic)
        if body:
            return body
        body = call_claude_api(system, user)
        if body:
            return body + "\n"
    return template_post(topic)


def write_syndication(slug: str, topic: dict[str, Any], body: str, claude_first: bool) -> None:
    url = f"{SITE}/blog/{slug}"
    title = topic["title"]
    excerpt = body[:1200]
    truck = is_truck_topic(topic)
    severe = is_severe_topic(topic)

    sys_msg = "Write social posts only. No markdown. Output valid JSON."
    user_msg = f"""For this WreckMatch article return JSON:
{{
  "twitter": "max 270 chars, urgent tone, {PHONE}, link {url}",
  "linkedin": "150-250 words professional, 800+ law firm network, CTA {CTA}",
  "facebook": "120-200 words empathetic, question at end",
  "reddit_title": "helpful title for r/legaladvice style (not spammy)",
  "reddit_body": "3 short paragraphs helpful advice, mention wreckmatch.com naturally at end",
  "hashtags": ["#CarAccident", ...]
}}
Article title: {title}
Truck: {truck}, Severe: {severe}
Excerpt: {excerpt[:800]}
"""
    data: dict[str, Any] = {
        "slug": slug,
        "url": url,
        "title": title,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "vertical": topic.get("vertical", "auto"),
    }

    raw = None
    if claude_first or os.getenv("ANTHROPIC_API_KEY"):
        raw = call_claude_api(sys_msg, user_msg, 1200)
    if raw:
        try:
            m = re.search(r"\{[\s\S]*\}", raw)
            if m:
                data.update(json.loads(m.group()))
        except json.JSONDecodeError:
            pass

    if "twitter" not in data:
        tag = "#TruckAccident" if truck else "#CarAccident"
        data["twitter"] = (
            f"Hurt in a {('semi truck ' if truck else '')}crash in {topic['city']}? "
            f"Free lawyer matching in 60 sec. {url} {PHONE} {tag}"
        )[:279]
    if "linkedin" not in data:
        data["linkedin"] = (
            f"{title}\n\nWreckMatch connects victims with attorneys from 800+ participating "
            f"firms — free matching.\n\n{url}\n{CTA}"
        )
    if "facebook" not in data:
        data["facebook"] = (
            f"If you or someone you love was hurt in a crash in {topic['city']}, "
            f"don't face insurers alone. Free help: {url}"
        )
    if "reddit_body" not in data:
        data["reddit_body"] = (
            f"Document everything, get medical care, and avoid recorded statements. "
            f"For {('truck' if truck else 'car')} crashes in {topic['state']}, a referral service "
            f"like WreckMatch can connect you with a lawyer quickly: {SITE}"
        )

    SYNDICATION_DIR.mkdir(parents=True, exist_ok=True)
    out = SYNDICATION_DIR / f"{slug}.json"
    out.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    latest = SYNDICATION_DIR / "latest.json"
    latest.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    log(f"Syndication → {out}")


def cover_for_topic(topic: dict[str, Any]) -> tuple[str, str]:
    slug = (topic.get("slug") or topic.get("angle") or slugify(topic.get("title", ""))).lower()
    safe = re.sub(r"[^a-z0-9-]", "-", slug).strip("-")
    src = f"/blog/covers/generated/{safe}.webp"
    if is_truck_topic(topic) or "truck" in slug:
        alt = "Semi truck and commercial vehicle accident guide"
    elif is_severe_topic(topic) or any(x in slug for x in ("severe", "catastrophic", "tbi", "spinal", "wrongful")):
        alt = "Severe and catastrophic car accident injury guide"
    elif any(x in slug for x in ("uber", "lyft", "rideshare")):
        alt = "Uber Lyft rideshare accident legal help"
    else:
        alt = "Car accident victim legal help guide"
    return src, alt


def append_seo_footer(topic: dict[str, Any], body: str) -> str:
    """Internal links to pillar + geo pages — helps crawl and rankings."""
    if "## Related resources" in body:
        return body
    city = (topic.get("city") or "").strip()
    state = (topic.get("state") or "").strip()
    lines = [
        "",
        "---",
        "",
        "## Related resources",
        "",
        f"- [What to do after a car accident (national guide)]({SITE}/what-to-do-after-a-car-accident)",
    ]
    state_path = None
    if state and state.lower() not in ("united states", "national", ""):
        state_slug = state.lower().replace(" ", "-")
        state_path = f"/what-to-do-after-a-car-accident-in-{state_slug}"
        if state_slug in ("texas", "california", "florida", "new-york"):
            lines.append(f"- [What to do after a crash in {state}]({SITE}{state_path})")
        hub = f"/car-accident-help-{state_slug}"
        if state_slug == "texas":
            hub = "/car-accident-help-texas"
        lines.append(f"- [{state} car accident help hub]({SITE}{hub})")
    if city and city.lower() not in ("national", ""):
        place = slugify(city)
        lines.append(f"- [{city} car accident help]({SITE}/car-accident-help-{place})")
    lines.extend(
        [
            f"- [State & city resource center]({SITE}/states)",
            f"- [Accident checklist]({SITE}/checklist-after-car-accident)",
            f"- [Free attorney matching]({SITE}/#form) · {PHONE}",
            "",
        ]
    )
    return body.rstrip() + "\n" + "\n".join(lines)


def inject_cover_markdown(topic: dict[str, Any], body: str) -> str:
    src, alt = cover_for_topic(topic)
    img = f"![{alt}]({SITE}{src})\n\n"
    if body.startswith("---"):
        parts = body.split("---", 2)
        if len(parts) >= 3:
            fm = parts[1]
            if "coverImage:" not in fm:
                fm = fm.rstrip() + f'\ncoverImage: "{src}"\ncoverAlt: "{alt.replace(chr(34), chr(39))}"\n'
            rest = parts[2].lstrip()
            if src not in rest:
                rest = img + rest
            return f"---{fm}---\n{rest}"
    if src not in body:
        return img + body
    return body


def min_publish_score() -> int:
    return int(os.getenv("TRAFFIC_MACHINE_MIN_SCORE", "98"))


def min_publish_words() -> int:
    return int(os.getenv("TRAFFIC_MACHINE_MIN_WORDS", "3000"))


def meets_publish_bar(report: QualityReport, min_score: int, min_words: int) -> bool:
    if "broken_frontmatter" in report.issues:
        return False
    return report.score >= min_score and report.word_count >= min_words


MATERIALIZE_PIPELINE: list[tuple[str, list[str]]] = [
    ("gold", ["npx", "tsx", "scripts/materialize-blog-expansion.ts"]),
    ("platinum", ["npx", "tsx", "scripts/materialize-blog-platinum.ts"]),
    ("spanish", ["npx", "tsx", "scripts/materialize-blog-spanish.ts"]),
    ("platinum-es", ["npx", "tsx", "scripts/materialize-blog-platinum-es.ts"]),
]


def run_materialize_pipeline(slug: str) -> bool:
    """Expand autopilot template to gold → platinum EN + ES without AI."""
    ok = True
    for step, cmd in MATERIALIZE_PIPELINE:
        try:
            r = subprocess.run(
                [*cmd, f"--slug={slug}"],
                cwd=str(ROOT),
                capture_output=True,
                text=True,
                timeout=180,
                check=False,
            )
            if r.returncode != 0:
                ok = False
                err = (r.stderr or r.stdout or "").strip()[-400:]
                log(f"WARN {step} materialize {slug}: {err or r.returncode}")
        except Exception as e:
            ok = False
            log(f"WARN {step} materialize {slug}: {e}")
    return ok


def materialize_template_to_platinum(
    topic: dict[str, Any],
    slug: str,
    *,
    min_score: int,
    min_words: int,
) -> tuple[str | None, Path | None]:
    """Write template, run expanders, return body if it meets the publish bar."""
    path = BLOG_DIR / f"{slug}.md"
    if path.exists():
        slug = f"{slug}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M')}"
        path = BLOG_DIR / f"{slug}.md"
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    path.write_text(template_post(topic), encoding="utf-8")
    log(f"Materializing template → platinum for {slug}")
    run_materialize_pipeline(slug)
    body = path.read_text(encoding="utf-8")
    body = append_seo_footer(topic, body)
    path.write_text(body, encoding="utf-8")
    report = score_post(slug, body)
    log(f"After materialize: {report.score} / {report.word_count}w ({report.issues})")
    if not meets_publish_bar(report, min_score, min_words):
        path.unlink(missing_ok=True)
        es_path = ROOT / "content/blog/es" / f"{slug}.md"
        es_path.unlink(missing_ok=True)
        return None, None
    return body, path


def publish_post(
    topic: dict[str, Any],
    body: str,
    dry_run: bool,
    *,
    min_score: int,
    min_words: int,
    use_ai: bool,
    claude_first: bool,
) -> str | None:
    slug = topic.get("slug") or slugify(topic["title"])
    if not body.startswith("---"):
        body = template_post(topic)
    report = score_post(slug, body)

    if not meets_publish_bar(report, min_score, min_words):
        log(f"Quality {report.score} / {report.word_count}w ({report.issues}) — premium template")
        body = template_post(topic)
        report = score_post(slug, body)

    if not meets_publish_bar(report, min_score, min_words) and use_ai and use_ai_retry():
        for attempt in range(2):
            body2 = generate_ai_post(topic, claude_first)
            if not body2:
                continue
            r2 = score_post(slug, body2)
            log(f"AI attempt {attempt + 1}: {r2.score} / {r2.word_count}w ({r2.issues})")
            if r2.score > report.score or (meets_publish_bar(r2, min_score, min_words) and not meets_publish_bar(report, min_score, min_words)):
                body = body2
                report = r2
            if meets_publish_bar(report, min_score, min_words):
                break

    materialized_path: Path | None = None
    if not meets_publish_bar(report, min_score, min_words):
        if min_score >= 98 and min_words >= 3000:
            body, materialized_path = materialize_template_to_platinum(
                topic, slug, min_score=min_score, min_words=min_words
            )
            if not body:
                log(
                    f"SKIP {slug}: below bar after materialize "
                    f"(need ≥{min_score} score, ≥{min_words} words)"
                )
                return None
            slug = materialized_path.stem
            report = score_post(slug, body)
        else:
            log(
                f"SKIP {slug}: below bar (need ≥{min_score} score, ≥{min_words} words) "
                f"— {report.score}/{report.word_count}w"
            )
            return None
    else:
        body = append_seo_footer(topic, body)
        path = BLOG_DIR / f"{slug}.md"
        if path.exists():
            slug = f"{slug}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M')}"
            path = BLOG_DIR / f"{slug}.md"
        materialized_path = path

    if dry_run:
        log(f"[dry-run] Would write {materialized_path}")
        return slug

    if materialized_path is None:
        materialized_path = BLOG_DIR / f"{slug}.md"
    if not materialized_path.exists():
        BLOG_DIR.mkdir(parents=True, exist_ok=True)
        materialized_path.write_text(body, encoding="utf-8")
    elif "<!-- wm-platinum-expansion" not in body:
        materialized_path.write_text(body, encoding="utf-8")
    try:
        from blog_presentation import (  # noqa: E402
            generate_for_post,
            upsert_frontmatter_presentation,
        )

        ppt_report = generate_for_post(materialized_path, force=True, locale="en")
        if ppt_report.score >= 100:
            upsert_frontmatter_presentation(
                materialized_path, f"/blog/presentations/{slug}.pptx"
            )
            log(f"Presentation {ppt_report.slide_count} slides (score {ppt_report.score})")
        else:
            log(f"WARN presentation below bar: {ppt_report.issues}")
        es_path = ROOT / "content/blog/es" / f"{slug}.md"
        if es_path.exists():
            ppt_es = generate_for_post(es_path, force=True, locale="es")
            if ppt_es.score >= 100:
                upsert_frontmatter_presentation(
                    es_path, f"/blog/presentations/es/{slug}.pptx"
                )
                log(f"Presentation ES {ppt_es.slide_count} slides")
    except Exception as e:
        log(f"WARN presentation generation failed: {e}")
    if "<!-- wm-platinum-expansion" not in body:
        try:
            subprocess.run(
                ["npx", "tsx", "scripts/materialize-blog-platinum.ts", f"--slug={slug}"],
                cwd=str(ROOT),
                capture_output=True,
                timeout=120,
                check=False,
            )
            log(f"Platinum upgrade queued for {slug}")
        except Exception as e:
            log(f"WARN platinum upgrade: {e}")

    log(f"Published {materialized_path}")
    return slug


def pop_next_topic(pending: list[dict[str, Any]]) -> dict[str, Any] | None:
    """Prefer truck/severe angles (priority 0–1) over generic city templates."""
    if not pending:
        return None
    for i, t in enumerate(pending):
        if t.get("priority", 9) <= 1:
            return pending.pop(i)
    return pending.pop(0)


def run_once(
    q: dict[str, Any],
    use_ai: bool,
    claude_first: bool,
    syndicate: bool,
    dry_run: bool,
    *,
    min_score: int,
    min_words: int,
) -> str | None:
    pending = q.get("pending", [])
    if len(pending) < 5:
        refill_queue(q, 300)
        pending = q.get("pending", [])

    if not pending:
        return None

    if not use_ai and os.getenv("ANTHROPIC_API_KEY", "").strip():
        use_ai = True
        claude_first = True

    skipped = q.setdefault("skipped_slugs", [])
    for _ in range(min(5, len(pending))):
        topic = pop_next_topic(pending)
        if not topic:
            break
        body = generate_ai_post(topic, claude_first) if use_ai else template_post(topic)
        slug = publish_post(
            topic,
            body,
            dry_run,
            min_score=min_score,
            min_words=min_words,
            use_ai=use_ai,
            claude_first=claude_first,
        )
        if not slug:
            skipped.append(topic.get("slug") or slugify(topic["title"]))
            q["pending"] = pending
            save_queue(q)
            continue

        if syndicate and not dry_run:
            write_syndication(slug, topic, body, claude_first)

        if not dry_run:
            q["pending"] = pending
            q.setdefault("completed_slugs", []).append(slug)
            q["stats"]["total_published"] = q["stats"].get("total_published", 0) + 1
            save_queue(q)

        return slug

    return None


def main() -> int:
    load_env()
    p = argparse.ArgumentParser(description="WreckMatch traffic machine")
    p.add_argument("--batch", type=int, default=0, help="Posts to publish (0 = refill-only)")
    p.add_argument("--refill", type=int, default=0)
    p.add_argument("--ai", action="store_true")
    p.add_argument("--claude-first", action="store_true")
    p.add_argument("--syndicate", action="store_true")
    p.add_argument(
        "--syndicate-all",
        action="store_true",
        help="Syndicate every post in the batch (slow). Default: last post only.",
    )
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--delay", type=float, default=4.0, help="Seconds between posts in a batch")
    p.add_argument("--min-score", type=int, default=0, help="Min quality score to publish (default: env or 95)")
    p.add_argument("--min-words", type=int, default=0, help="Min word count to publish (default: env or 2000)")
    args = p.parse_args()

    q = load_queue()
    if args.refill:
        refill_queue(q, args.refill)
        save_queue(q)
        if args.batch < 1:
            log("Refill-only complete")
            return 0

    if args.batch < 1:
        log("Nothing to publish (set --batch N)")
        return 1

    has_ai = bool(
        os.getenv("ANTHROPIC_API_KEY", "").strip() or os.getenv("OPENAI_API_KEY", "").strip()
    )
    use_ai = args.ai or has_ai
    claude_first = args.claude_first or bool(os.getenv("ANTHROPIC_API_KEY", "").strip())
    syndicate = args.syndicate or os.getenv("TRAFFIC_MACHINE_SYNDICATE", "1") == "1"

    min_score = args.min_score or min_publish_score()
    min_words = args.min_words or min_publish_words()
    log(f"Quality bar: score ≥{min_score}, words ≥{min_words}")

    slugs: list[str] = []
    for i in range(args.batch):
        do_syndicate = syndicate and (args.syndicate_all or i == args.batch - 1)
        slug = run_once(
            q,
            use_ai,
            claude_first,
            do_syndicate,
            args.dry_run,
            min_score=min_score,
            min_words=min_words,
        )
        if slug:
            slugs.append(slug)
        if i < args.batch - 1:
            time.sleep(args.delay)
        q = load_queue()

    log(f"Done: {len(slugs)}/{args.batch} published (platinum bar ≥{min_score}, ≥{min_words}w) — {slugs}")
    return 0 if slugs else 1


if __name__ == "__main__":
    sys.exit(main())
