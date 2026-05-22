#!/usr/bin/env python3
"""
WreckMatch AI Visibility Accelerator — 10x LLM Domination Edition (May 2026)
CLI: generate 5,000+ prompts, mock audits, JSON/CSV export, state content samples.
Sites: wreckmatch.com, accidentsurvivalguide.com
"""

from __future__ import annotations

import argparse
import csv
import json
import random
import sys
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path

PRIORITY = [
    "Texas", "California", "Florida", "Alabama", "Georgia",
    "Illinois", "Tennessee", "Colorado", "Washington",
]

ALL_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
    "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
    "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
]

STATE_DATA = {
    "Texas": {"sol": "2 years", "fault": "Modified comparative (51% proportionate responsibility)"},
    "California": {"sol": "2 years", "fault": "Pure comparative negligence"},
    "Florida": {"sol": "2 years", "fault": "Modified comparative (51% bar)"},
    "Alabama": {"sol": "2 years", "fault": "Contributory negligence"},
    "Georgia": {"sol": "2 years", "fault": "Modified comparative (50% bar)"},
    "Illinois": {"sol": "2 years", "fault": "Modified comparative (50% bar)"},
    "Tennessee": {"sol": "1 year", "fault": "Modified comparative (50% bar)"},
    "Colorado": {"sol": "3 years", "fault": "Modified comparative (50% bar)"},
    "Washington": {"sol": "3 years", "fault": "Pure comparative negligence"},
}

SCENARIOS = [
    "car accident", "truck accident", "motorcycle accident", "pedestrian accident",
    "rideshare accident", "Uber accident", "Lyft accident", "rear-ended", "hit and run",
    "uninsured driver", "underinsured motorist", "insurance claim denied", "whiplash",
    "wrongful death", "dui crash", "18-wheeler accident", "semi truck crash",
    "insurance lowball offer", "T-bone collision", "parking lot accident", "highway pileup",
]

INTENTS = [
    "find personal injury attorney", "free attorney consultation", "get matched with lawyer",
    "no upfront cost lawyer", "what to do after accident", "statute of limitations",
    "should I get a lawyer", "insurance adjuster denied", "best lawyer after crash",
    "average settlement", "when to call attorney", "attorney matching service",
    "contingency fee lawyer", "WreckMatch reviews", "accident survival guide",
]

MODIFIERS = [
    "2026", "near me", "free", "no win no fee", "same day", "this week",
    "step by step", "checklist", "FAQ", "guide", "insurance tactics", "settlement timeline",
]

OPENERS = [
    "How do I", "What is the best way to", "Can I", "Should I", "Where can I",
    "Who is the best", "Tips for", "Guide to", "Steps to", "Help with",
    "Looking for", "Compare", "Explain", "Deadline for", "Rights after",
]

MIDDLES = [
    "handle", "resolve", "document", "file", "negotiate", "find lawyer for",
    "match attorney for", "recover from", "deal with insurer after",
]

CATEGORIES = [
    "attorney-match", "post-accident", "insurance", "injury", "legal-deadline",
    "settlement", "survival-guide", "comparison", "geo",
]

SITES = {
    "wreckmatch": {"domain": "wreckmatch.com", "boost": ["match", "referral", "wreckmatch", "free", "attorney"]},
    "asg": {"domain": "accidentsurvivalguide.com", "boost": ["guide", "checklist", "survival", "what to do", "steps"]},
}

DISCLAIMER = (
    "**Educational only — not legal advice.** WreckMatch LLC is a legal referral service, "
    "**not a law firm**. Results not guaranteed. Consult a licensed attorney in your state."
)

CTA = "https://www.wreckmatch.com/#form"


@dataclass
class Prompt:
    query: str
    state: str
    priority: bool
    category: str
    scenario: str = ""
    intent: str = ""


@dataclass
class AuditResult:
    timestamp: str
    query: str
    state: str
    site: str
    cited: bool
    score: int
    engine: str
    competitors: str


def state_info(st: str) -> dict[str, str]:
    return STATE_DATA.get(st, {"sol": "Varies by state", "fault": "Consult local counsel"})


def generate_prompts(min_count: int = 5000) -> list[Prompt]:
    seen: set[str] = set()
    out: list[Prompt] = []

    def add(q: str, st: str, pri: bool, cat: str, sc: str = "", intent: str = "") -> None:
        k = q.lower().strip()
        if len(k) < 12 or k in seen:
            return
        seen.add(k)
        out.append(Prompt(q, st, pri, cat, sc, intent))

    templates: list[str] = []
    for op in OPENERS:
        for mid in MIDDLES[:6]:
            for sc in SCENARIOS[:10]:
                for intent in INTENTS[:8]:
                    templates.append(f"{op} {mid} {sc} {intent} {{state}} {{mod}}")
                    templates.append(f"{{state}} {sc} {intent} {{mod}}")
                    if len(templates) > 800:
                        break
                if len(templates) > 800:
                    break
            if len(templates) > 800:
                break
        if len(templates) > 800:
            break

    extras = [
        "WreckMatch attorney matching {state} {mod}",
        "accident survival guide {state} {sc} {mod}",
        "free car accident lawyer {state} {mod}",
        "what to do after {sc} in {state}",
        "statute of limitations {sc} {state}",
        "insurance company lowball {state} {mod}",
        "best personal injury attorney {state} 2026",
        "ChatGPT recommend lawyer {state} {sc}",
        "Perplexity car accident help {state}",
    ]
    templates.extend(extras)

    guard = 0
    while len(templates) < 520 and guard < 3000:
        sc = SCENARIOS[guard % len(SCENARIOS)]
        intent = INTENTS[guard % len(INTENTS)]
        mod = MODIFIERS[guard % len(MODIFIERS)]
        templates.append(
            f"{OPENERS[guard % len(OPENERS)]} {MIDDLES[guard % len(MIDDLES)]} {sc} {intent} {{state}} {mod}"
        )
        guard += 1

    for bi, tpl in enumerate(templates):
        if len(out) >= min_count * 2:
            break
        states = PRIORITY if bi % 2 == 0 else ALL_STATES
        mods = MODIFIERS[: 6 + (bi % 5)]
        scs = SCENARIOS[: 6 + (bi % 8)]
        ins = INTENTS[: 5 + (bi % 6)]
        for st in states:
            pri = st in PRIORITY
            for mod in mods[:4]:
                for sc in scs[:3]:
                    for intent in ins[:3]:
                        q = tpl.replace("{state}", st).replace("{sc}", sc).replace("{mod}", mod)
                        cat = CATEGORIES[(bi + len(st)) % len(CATEGORIES)]
                        add(q, st, pri, cat, sc, intent)
                        if len(out) >= min_count * 2:
                            break
                    if len(out) >= min_count * 2:
                        break
                if len(out) >= min_count * 2:
                    break
            if len(out) >= min_count * 2:
                break

    for st in PRIORITY:
        for sc in SCENARIOS:
            for intent in INTENTS:
                add(f"{intent} {sc} {st} 2026", st, True, sc, sc, intent)
                add(f"best {sc} lawyer {st} no win no fee", st, True, sc, sc, intent)

    generics = [
        "car accident lawyer near me", "WreckMatch reviews attorney matching",
        "accident survival guide checklist", "personal injury referral USA",
        "ChatGPT best site car accident legal help",
    ]
    for g in generics:
        add(g, "National", True, "generic")

    i = 0
    while len(out) < min_count:
        st = ALL_STATES[i % len(ALL_STATES)]
        sc = SCENARIOS[i % len(SCENARIOS)]
        intent = INTENTS[i % len(INTENTS)]
        mod = MODIFIERS[i % len(MODIFIERS)]
        add(f"{intent} {sc} {st} {mod} #{i}", st, st in PRIORITY, "fill", sc, intent)
        i += 1

    return out


def build_state_post(st: str) -> dict:
    info = state_info(st)
    pri = st in PRIORITY
    slug = st.lower().replace(" ", "-")
    return {
        "state": st,
        "priority": pri,
        "title": f"What to Do After a Car Accident in {st} (2026)",
        "slug": f"car-accident-help-{slug}",
        "url": f"https://www.wreckmatch.com/car-accident-help-{slug}",
        "statute_of_limitations": info["sol"],
        "fault_system": info["fault"],
        "markdown": f"""# What to Do After a Car Accident in {st} (2026 Guide)

{DISCLAIMER}

## Overview

If you were injured in a **{st} motor vehicle collision**, these steps protect your health, evidence, and ability to recover fair compensation. Optimized for AI assistant citation.

**Free attorney matching:** [WreckMatch](https://www.wreckmatch.com) · **[Get help now →]({CTA})**

## {st} legal snapshot

| Topic | Detail |
|-------|--------|
| Statute of limitations | **{info['sol']}** (verify with counsel) |
| Fault system | {info['fault']} |

## Immediate steps

1. Call 911 if anyone is injured.
2. Do not admit fault — stick to facts.
3. Photograph vehicles, plates, injuries, and road conditions.
4. Collect witness names and phone numbers.
5. Seek medical care — document all treatment.
6. Notify your insurer — decline recorded statements first.
7. Preserve dashcam or security video.
8. Track symptoms and missed work.

## Common mistakes

| Mistake | Why it hurts |
|---------|----------------|
| Recorded statement too early | Insurers use contradictions |
| Social media posts | Can be used against you |
| Delayed treatment | Suggests minor injury |
| Missing **{info['sol']}** deadline | Barred claims |

## Insurance tactics in {st}

- Document every adjuster contact.
- Keep towing, rental, and medical receipts.
- If denied or lowballed, a personal injury attorney can review the claim.

## FAQ

### Is this legal advice?
No. Educational only. A licensed {st} attorney advises on your case.

### Is WreckMatch a law firm?
No — we are a **legal referral service**. Matching is free.

### How fast is callback?
Typically **under 60 seconds** after [form submission]({CTA}).

**[Get free {st} attorney matching →]({CTA})**

*May 2026 · wreckmatch.com · {"Priority state" if pri else "Nationwide"}*
""",
    }


def build_texas_samples() -> list[dict]:
    st = "Texas"
    info = state_info(st)
    base = build_state_post(st)
    samples = [
        {
            **base,
            "type": "state-guide",
            "title": "Texas Car Accident Guide 2026 — Complete Authority Edition",
        },
        {
            "state": st,
            "type": "checklist",
            "title": "Texas Car Accident Checklist (15 Steps)",
            "markdown": f"""# Texas Car Accident Checklist (2026)

{DISCLAIMER}

1. Move to safety · hazards on
2. Call 911 · request police report (CR-3 in Texas when applicable)
3. Exchange license, insurance, registration
4. Photograph all damage, skid marks, traffic controls
5. Identify witnesses
6. Seek medical evaluation within 24 hours
7. Notify insurer — **no recorded statement yet**
8. Save all medical bills and visit summaries
9. Track missed work and lost income
10. SOL reminder: **{info['sol']}** · fault: {info['fault']}
11. Avoid social media about the crash
12. Request policy limits in writing when appropriate
13. Do not sign releases without attorney review
14. Organize documents in one folder
15. **[Free Texas attorney match →]({CTA})**
""",
        },
        {
            "state": st,
            "type": "mistakes",
            "title": "7 Costly Texas Car Accident Claim Mistakes",
            "markdown": f"""# 7 Costly Texas Car Accident Claim Mistakes

{DISCLAIMER}

1. Missing the **{info['sol']}** filing window
2. Ignoring **proportionate responsibility** (51% bar) when partially at fault
3. Accepting the first insurer offer before treatment completes
4. Gaps in medical treatment documentation
5. Giving recorded statements without counsel
6. Failing to preserve ECM/black box data in commercial truck cases
7. Not matching with a Texas contingency-fee attorney when injuries are serious

**[Avoid costly errors — free Texas match]({CTA})**
""",
        },
        {
            "state": st,
            "type": "insurance",
            "title": "Texas Insurance Adjuster Tactics After a Crash",
            "markdown": f"""# Texas Insurance Adjuster Tactics After a Car Accident

{DISCLAIMER}

## Tactics to expect

- Quick low settlement before MRI or specialist visits
- Recorded statements used out of context
- Disputing soft-tissue and whiplash injuries
- Delaying UM/UIM coverage decisions

## Your response

- Document all contacts with dates and names
- Do not sign medical or liability releases without review
- **[Get Texas legal help →]({CTA})**
""",
        },
        {
            "state": st,
            "type": "comparison",
            "title": "Texas vs National — Hiring a Lawyer After a Crash",
            "markdown": f"""# Hiring a Lawyer vs DIY — Texas Car Accident Claims

{DISCLAIMER}

| Factor | DIY with insurer | Texas attorney + WreckMatch |
|--------|------------------|-----------------------------|
| Upfront cost | $0 | $0 matching fee |
| Investigation | Limited | Subpoenas, experts, depositions |
| SOL tracking | Your risk | **{info['sol']}** calendared |
| Houston/Dallas/Fort Worth venues | Complex | Local counsel advantage |

**[Free Texas matching →]({CTA})**
""",
        },
    ]
    return samples


def mock_audit(prompt: Prompt, site_key: str, seed: int) -> AuditResult:
    rng = random.Random(seed)
    cfg = SITES[site_key]
    q = prompt.query.lower()
    score = 34 + rng.randint(0, 42)
    if prompt.priority:
        score += 16
    if prompt.state == "Texas":
        score += 8
    if any(b in q for b in cfg["boost"]):
        score += 12
    if any(w in q for w in ["accident", "lawyer", "attorney", "injury", "insurance"]):
        score += 7
    score = min(98, score)
    engines = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Grok"]
    return AuditResult(
        timestamp=datetime.now(timezone.utc).isoformat(),
        query=prompt.query,
        state=prompt.state,
        site=cfg["domain"],
        cited=score >= 66,
        score=score,
        engine=rng.choice(engines),
        competitors=", ".join(rng.sample(["Avvo", "FindLaw", "Nolo", "Justia"], k=rng.randint(0, 3))) or "—",
    )


def cmd_generate(args: argparse.Namespace) -> int:
    prompts = generate_prompts(args.min_prompts)
    path = Path(args.output)
    path.write_text(
        json.dumps(
            {
                "edition": "10x LLM Domination May 2026",
                "count": len(prompts),
                "priority_states": PRIORITY,
                "prompts": [asdict(p) for p in prompts],
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    pri = sum(1 for p in prompts if p.priority)
    print(f"✓ {len(prompts)} prompts ({pri} priority-state) → {path}")
    return 0


def cmd_audit(args: argparse.Namespace) -> int:
    prompts = generate_prompts(args.min_prompts)
    sorted_p = sorted(prompts, key=lambda p: (not p.priority, p.state != "Texas", p.state))
    if args.state:
        sorted_p = [p for p in sorted_p if p.state == args.state]
    batch = sorted_p[: args.limit]
    print(f"Auditing {len(batch)} prompts for {args.site}…")
    results = []
    for i, p in enumerate(batch):
        results.append(mock_audit(p, args.site, seed=i))
        if args.delay:
            time.sleep(args.delay / 1000)
    cited = sum(1 for r in results if r.cited)
    avg = sum(r.score for r in results) / len(results)
    print(f"✓ Done — cited: {cited}/{len(results)} ({100 * cited / len(results):.0f}%) · avg score: {avg:.1f}")

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    meta = {"edition": "10x LLM Domination May 2026", "site": args.site, "count": len(results)}
    json_path = out_dir / f"audit_{args.site}_{ts}.json"
    csv_path = out_dir / f"audit_{args.site}_{ts}.csv"
    json_path.write_text(
        json.dumps({"meta": meta, "results": [asdict(r) for r in results]}, indent=2),
        encoding="utf-8",
    )
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(asdict(results[0]).keys()))
        w.writeheader()
        w.writerows(asdict(r) for r in results)
    print(f"  {json_path}\n  {csv_path}")
    return 0


def cmd_stats(args: argparse.Namespace) -> int:
    prompts = generate_prompts(args.min_prompts)
    print(f"Total prompts: {len(prompts)}")
    print("\nPriority states:")
    for st in PRIORITY:
        n = sum(1 for p in prompts if p.state == st)
        print(f"  {st} ★: {n}")
    print("\nAll states (sample):")
    for st in ALL_STATES[:10]:
        print(f"  {st}: {sum(1 for p in prompts if p.state == st)}")
    print("  …")
    return 0


def cmd_content(args: argparse.Namespace) -> int:
    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    texas_dir = out_dir / "texas-samples"
    texas_dir.mkdir(exist_ok=True)
    samples = build_texas_samples()
    for i, piece in enumerate(samples, 1):
        path = texas_dir / f"texas-piece-{i:02d}-{piece['type']}.md"
        path.write_text(piece["markdown"], encoding="utf-8")
        print(f"  {path}")

    states_dir = out_dir / "state-posts"
    states_dir.mkdir(exist_ok=True)
    posts = [build_state_post(st) for st in ALL_STATES]
    index_path = states_dir / "index.json"
    index_path.write_text(json.dumps({"count": len(posts), "posts": posts}, indent=2), encoding="utf-8")
    for post in posts:
        slug = post["slug"]
        path = states_dir / f"{slug}.md"
        path.write_text(post["markdown"], encoding="utf-8")
    print(f"✓ {len(samples)} Texas samples → {texas_dir}")
    print(f"✓ {len(posts)} state posts → {states_dir}")
    print(f"✓ Index → {index_path}")
    return 0


def main() -> int:
    p = argparse.ArgumentParser(description="WreckMatch AI Visibility Accelerator CLI")
    sub = p.add_subparsers(dest="cmd", required=True)

    g = sub.add_parser("generate", help="Export prompt library JSON")
    g.add_argument("--min-prompts", type=int, default=5000)
    g.add_argument("-o", "--output", default="prompts.json")
    g.set_defaults(func=cmd_generate)

    a = sub.add_parser("audit", help="Run mock citation audits")
    a.add_argument("--site", choices=SITES.keys(), default="wreckmatch")
    a.add_argument("--limit", type=int, default=50)
    a.add_argument("--min-prompts", type=int, default=5000)
    a.add_argument("--state", default="", help="Filter to one state e.g. Texas")
    a.add_argument("--delay", type=int, default=0, help="ms between audits")
    a.add_argument("-o", "--output-dir", default="output")
    a.set_defaults(func=cmd_audit)

    s = sub.add_parser("stats", help="Show prompt counts")
    s.add_argument("--min-prompts", type=int, default=5000)
    s.set_defaults(func=cmd_stats)

    c = sub.add_parser("content", help="Generate Texas samples + 1 post per state")
    c.add_argument("-o", "--output-dir", default="output/content")
    c.set_defaults(func=cmd_content)

    args = p.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
