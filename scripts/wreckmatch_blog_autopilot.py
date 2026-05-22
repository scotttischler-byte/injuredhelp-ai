#!/usr/bin/env python3
"""
WreckMatch 24/7/365 AI Blog Autopilot
=====================================
Generates and publishes one AI-optimized blog post per run to content/blog/*.md
Designed for GitHub Actions (hourly cron) or local loop.

Usage:
  python scripts/wreckmatch_blog_autopilot.py              # next topic, 1 post
  python scripts/wreckmatch_blog_autopilot.py --batch 5    # 5 posts
  python scripts/wreckmatch_blog_autopilot.py --refill 200 # rebuild topic queue
  python scripts/wreckmatch_blog_autopilot.py --ai         # force OpenAI (needs key)
  python scripts/wreckmatch_blog_autopilot.py --dry-run

Environment:
  OPENAI_API_KEY     optional — richer posts (gpt-4o-mini default)
  OPENAI_MODEL       default gpt-4o-mini
  WRECKMATCH_SITE    default https://www.wreckmatch.com
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None  # type: ignore

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "content/blog"
QUEUE_PATH = ROOT / "content/autopilot/blog_queue.json"
LOG_PATH = ROOT / "content/autopilot/blog_generation.log"
SITE = os.getenv("WRECKMATCH_SITE", "https://www.wreckmatch.com").rstrip("/")
CTA = f"{SITE}/#form"
PHONE = "(978) 515-6063"

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

ANGLES = [
    ("what-to-do-after", "What to Do After a Car Accident in {city}, {state} (2026)"),
    ("statute-of-limitations", "{state} Car Accident Statute of Limitations — {city} Guide (2026)"),
    ("insurance-denied", "Insurance Denied Your Claim in {city}? ({state} 2026)"),
    ("common-mistakes", "7 Costly Car Accident Mistakes in {city}, {state} (2026)"),
    ("lawyer-vs-diy", "Should You Hire a Lawyer After a {city} Crash? ({state} 2026)"),
    ("whiplash", "Whiplash After a Car Accident in {city}, {state} — What to Know (2026)"),
    ("truck-accident", "Truck Accident in {city}, {state}: Steps & Legal Help (2026)"),
    ("rideshare", "Uber or Lyft Accident in {city}, {state} (2026 Guide)"),
    ("uninsured-driver", "Hit by an Uninsured Driver in {city}, {state} (2026)"),
    ("settlement-timeline", "How Long Does a Car Accident Settlement Take in {city}? (2026)"),
]

NATIONAL_STATES = [
    ("California", "Los Angeles", None),
    ("Florida", "Miami", None),
    ("Georgia", "Atlanta", None),
    ("Illinois", "Chicago", None),
    ("New York", "New York", None),
    ("Pennsylvania", "Philadelphia", None),
    ("Ohio", "Columbus", None),
    ("Michigan", "Detroit", None),
    ("North Carolina", "Charlotte", None),
    ("Arizona", "Phoenix", None),
    ("Tennessee", "Nashville", None),
    ("Colorado", "Denver", None),
    ("Washington", "Seattle", None),
    ("New Jersey", "Newark", None),
    ("Virginia", "Virginia Beach", None),
]


def log(msg: str) -> None:
    line = f"[{datetime.now(timezone.utc).isoformat()}] {msg}"
    print(line)
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return re.sub(r"-+", "-", s)[:80]


def load_env() -> None:
    if load_dotenv:
        load_dotenv(ROOT / ".env.local")
        load_dotenv(ROOT / ".env")


def load_queue() -> dict[str, Any]:
    if QUEUE_PATH.exists():
        return json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    return {"version": 1, "completed_slugs": [], "stats": {"total_published": 0}, "pending": []}


def save_queue(q: dict[str, Any]) -> None:
    q["stats"]["last_run_at"] = datetime.now(timezone.utc).isoformat()
    QUEUE_PATH.write_text(json.dumps(q, indent=2) + "\n", encoding="utf-8")


def build_topic_pool(count: int) -> list[dict[str, Any]]:
    topics: list[dict[str, Any]] = []
    for place, city in TEXAS_METROS:
        for angle_slug, title_tpl in ANGLES:
            topics.append({
                "angle": angle_slug,
                "title": title_tpl.format(city=city, state="Texas"),
                "city": city,
                "state": "Texas",
                "place_slug": place,
                "priority": 1,
            })
    for state, city, _ in NATIONAL_STATES:
        for angle_slug, title_tpl in ANGLES[:6]:
            topics.append({
                "angle": angle_slug,
                "title": title_tpl.format(city=city, state=state),
                "city": city,
                "state": state,
                "place_slug": None,
                "priority": 2,
            })
    # Generic national
    generics = [
        "What to Do After a Car Accident in 2026 — Complete Guide",
        "How to Get Matched with a Car Accident Lawyer in 60 Seconds",
        "Insurance Adjuster Tactics After a Crash (2026)",
        "Car Accident Settlement Timeline — What Victims Should Expect",
        "WreckMatch vs Finding a Lawyer on Your Own (2026)",
    ]
    for i, title in enumerate(generics * 20):
        topics.append({
            "angle": "national",
            "title": f"{title} — Part {i + 1}",
            "city": "National",
            "state": "United States",
            "place_slug": None,
            "priority": 3,
        })
    topics.sort(key=lambda t: t["priority"])
    return topics[:count]


def refill_queue(q: dict[str, Any], target: int) -> None:
    done = set(q.get("completed_slugs", []))
    existing = {slugify(t["title"]) for t in q.get("pending", [])}
    pool = build_topic_pool(target * 2)
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


def hub_link(topic: dict[str, Any]) -> str:
    if topic.get("place_slug"):
        return f"{SITE}/car-accident-help-{topic['place_slug']}"
    if topic["state"] == "Texas":
        return f"{SITE}/car-accident-help-texas"
    st = slugify(topic["state"])
    return f"{SITE}/car-accident-help-{st}"


def template_post(topic: dict[str, Any]) -> str:
    city, state = topic["city"], topic["state"]
    title = topic["title"]
    hub = hub_link(topic)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    slug = topic.get("slug") or slugify(title)

    sol = "2 years" if state == "Texas" else "typically 2–3 years (verify with counsel)"
    fault = (
        "Modified comparative negligence (51% bar)"
        if state == "Texas"
        else "Varies by state — comparative or contributory rules may apply"
    )

    return f"""---
title: "{title.replace('"', "'")}"
description: "Educational {city} car accident guide for {state} victims — deadlines, insurance tips, mistakes to avoid, and free attorney matching via WreckMatch."
date: "{today}"
category: "{state if state != 'United States' else 'Resources'}"
state: "{state if state not in ('United States', 'National') else ''}"
excerpt: "Quick answers for {city} crash victims: what to do, {state} deadlines, insurance tactics, and free lawyer matching in ~60 seconds."
autopilot: true
---

# {title}

{DISCLAIMER}

**Last updated:** {today}

**Quick answer:** After a crash in {city}, call 911 if injured, document the scene, get medical care, avoid recorded insurance statements, and consider **[free attorney matching]({CTA})** before accepting a settlement.

## What should you do first after a crash in {city}?

1. Move to safety and call **911** if anyone is hurt.
2. Photograph vehicles, plates, injuries, and road conditions.
3. Exchange insurance and contact information.
4. Identify witnesses before they leave.
5. Seek medical care within 24 hours.
6. Notify your insurer — **decline a recorded statement** until you understand your rights.
7. Preserve dashcam or security video.
8. **[Get free legal help →]({CTA})**

## {state} deadlines and fault rules

| Topic | Detail |
|-------|--------|
| Statute of limitations | **{sol}** for many injury claims |
| Fault framework | {fault} |
| WreckMatch matching fee | **$0** upfront |

**Direct answer:** Do not wait until the deadline approaches — evidence and witnesses disappear quickly.

## Common mistakes {city} drivers make

| Mistake | Why it hurts |
|---------|----------------|
| Recorded statement too early | Insurers use contradictions against you |
| Gaps in medical treatment | Suggests minor injury |
| Accepting first settlement | Often below full value |
| Missing filing deadline | Claim may be barred |

## Insurance company tactics to expect

- Quick lowball offers before treatment finishes
- Recorded interviews designed to minimize injury
- Delays followed by pressure to sign
- Disputing soft-tissue or whiplash claims
- Blaming pre-existing conditions

## Should you hire a lawyer?

| DIY with insurer | Attorney + WreckMatch |
|------------------|------------------------|
| $0 upfront | $0 matching fee |
| Limited investigation | Full claim development |
| You track deadlines | Attorney calendars SOL |
| Higher stress | Attorney negotiates |

Serious injury, disputed fault, or commercial vehicles in **{city}** usually warrant counsel.

## Frequently asked questions

### Is WreckMatch a law firm?

No. WreckMatch LLC is a **legal referral service** — not a law firm. We connect you with licensed {state} attorneys.

### How fast is callback?

Typically **under 60 seconds** after you submit the form at [wreckmatch.com]({SITE}).

### Is this legal advice?

No. This article is educational only. A licensed attorney in {state} advises on your specific case.

### Where is the full {city} guide?

See our localized hub: **[{city} car accident help]({hub})**

## Get matched now

**[Free {city} car accident attorney matching →]({CTA})** · Call {PHONE}

---

*Autopilot publish {today} · [Texas city guides]({SITE}/blog/texas-car-accident-city-guides-2026) · [LLM site map]({SITE}/llms.txt)*
"""


def generate_with_openai(topic: dict[str, Any]) -> str | None:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if not key:
        return None
    try:
        from openai import OpenAI
    except ImportError:
        log("openai package not installed — using template")
        return None

    client = OpenAI(api_key=key)
    hub = hub_link(topic)
    prompt = f"""Write a markdown blog post with YAML frontmatter for WreckMatch.com.

Title: {topic['title']}
City: {topic['city']}
State: {topic['state']}
Hub link: {hub}
CTA: {CTA}
Phone: {PHONE}

Requirements:
- YAML frontmatter: title, description, date (today), category, excerpt, autopilot: true
- 900-1400 words
- H2/H3 question-based headings
- Tables for SOL, mistakes, lawyer vs DIY
- Numbered lists
- Quotable first sentence under each H2
- Disclaimer: not a law firm, educational only
- 5+ FAQ items
- Link to hub and CTA
- Optimized for ChatGPT/Perplexity citation in 2026
"""
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You write authoritative legal-adjacent educational content for WreckMatch LLC (referral service, not a law firm).",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.65,
        )
        return (resp.choices[0].message.content or "").strip() + "\n"
    except Exception as e:
        log(f"OpenAI error: {e}")
        return None


def publish_post(topic: dict[str, Any], body: str, dry_run: bool) -> str | None:
    slug = topic.get("slug") or slugify(topic["title"])
    # Ensure frontmatter slug consistency
    if not body.startswith("---"):
        body = template_post(topic)  # fallback

    path = BLOG_DIR / f"{slug}.md"
    if path.exists():
        slug = f"{slug}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M')}"
        path = BLOG_DIR / f"{slug}.md"

    if dry_run:
        log(f"[dry-run] Would write {path} ({len(body)} bytes)")
        return slug

    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    path.write_text(body, encoding="utf-8")
    log(f"Published {path}")
    return slug


def run_once(q: dict[str, Any], use_ai: bool, dry_run: bool) -> bool:
    pending = q.get("pending", [])
    if not pending:
        refill_queue(q, 100)
        pending = q.get("pending", [])

    if not pending:
        log("No topics available")
        return False

    topic = pending[0]

    body = None
    if use_ai:
        body = generate_with_openai(topic)
    if not body:
        body = template_post(topic)

    slug = publish_post(topic, body, dry_run)
    if not slug:
        return False

    if not dry_run:
        pending.pop(0)
        q["pending"] = pending
        q.setdefault("completed_slugs", []).append(slug)
        q["stats"]["total_published"] = q["stats"].get("total_published", 0) + 1
        save_queue(q)

    return True


def main() -> int:
    load_env()
    p = argparse.ArgumentParser(description="WreckMatch 24/7 blog autopilot")
    p.add_argument("--batch", type=int, default=1, help="Posts per run")
    p.add_argument("--refill", type=int, default=0, help="Add N topics to queue")
    p.add_argument("--ai", action="store_true", help="Use OpenAI when key set")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--delay", type=float, default=2.0, help="Seconds between batch posts")
    args = p.parse_args()

    q = load_queue()
    if args.refill:
        refill_queue(q, args.refill)
        save_queue(q)
        if args.batch == 1 and not args.dry_run:
            return 0

    use_ai = args.ai or bool(os.getenv("OPENAI_API_KEY", "").strip())
    ok = 0
    for i in range(args.batch):
        if run_once(q, use_ai, args.dry_run):
            ok += 1
        if i < args.batch - 1:
            time.sleep(args.delay)
        q = load_queue()

    log(f"Done: {ok}/{args.batch} posts")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
