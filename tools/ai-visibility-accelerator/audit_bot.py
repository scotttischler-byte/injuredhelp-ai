#!/usr/bin/env python3
"""
WreckMatch AI Visibility Accelerator — CLI audit bot
Generates 1,000+ high-intent prompts (priority: TX, CA, FL, AL, GA, IL, TN, CO, WA)
and runs batch visibility simulations for wreckmatch.com & accidentsurvivalguide.com.
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
from typing import Iterator

PRIORITY_STATES = [
    "Texas",
    "California",
    "Florida",
    "Alabama",
    "Georgia",
    "Illinois",
    "Tennessee",
    "Colorado",
    "Washington",
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

SCENARIOS = [
    "car accident", "truck accident", "semi truck crash", "motorcycle accident",
    "pedestrian accident", "bicycle accident", "rideshare accident", "Uber accident",
    "Lyft accident", "rear-ended", "T-bone collision", "hit and run", "uninsured driver",
    "underinsured motorist", "insurance claim denied", "insurance lowball settlement",
    "whiplash", "back injury", "traumatic brain injury", "wrongful death", "dui crash",
    "drunk driver accident", "commercial vehicle accident", "18-wheeler accident",
    "highway pileup", "parking lot accident", "intersection crash",
]

INTENTS = [
    "find personal injury attorney",
    "get matched with lawyer",
    "free attorney consultation",
    "no upfront cost lawyer",
    "contingency fee attorney",
    "best lawyer after accident",
    "how to hire car accident lawyer",
    "statute of limitations",
    "what to do after car accident",
    "should I get a lawyer",
    "average car accident settlement",
    "how long insurance claim takes",
    "insurance adjuster denied claim",
    "when to call lawyer after crash",
    "free legal help accident victim",
    "attorney matching service",
    "legal referral after crash",
]

GENERIC_QUERIES = [
    "car accident lawyer near me",
    "free accident attorney matching USA",
    "personal injury referral service",
    "WreckMatch legal referral reviews",
    "accident survival guide what to do",
    "how to find PI attorney after crash",
    "best way to get lawyer after car wreck",
    "no fee unless you win attorney matching",
]

SITES = {
    "wreckmatch": {
        "name": "WreckMatch",
        "domain": "wreckmatch.com",
        "url": "https://www.wreckmatch.com",
        "boost_keywords": ["match", "referral", "wreckmatch", "free", "60 second", "contingency"],
    },
    "asg": {
        "name": "Accident Survival Guide",
        "domain": "accidentsurvivalguide.com",
        "url": "https://accidentsurvivalguide.com",
        "boost_keywords": ["guide", "checklist", "survival", "what to do", "steps", "download"],
    },
}


@dataclass
class Prompt:
    query: str
    state: str
    priority: bool
    category: str


@dataclass
class AuditResult:
    timestamp: str
    query: str
    state: str
    site: str
    cited: bool
    score: int
    competitors: str
    snippet: str


def generate_prompts(min_count: int = 1000) -> list[Prompt]:
    """Build 1,000+ unique high-intent prompts with heavy priority-state weighting."""
    seen: set[str] = set()
    prompts: list[Prompt] = []

    def add(query: str, state: str, priority: bool, category: str) -> None:
        key = query.lower().strip()
        if key in seen:
            return
        seen.add(key)
        prompts.append(Prompt(query=query, state=state, priority=priority, category=category))

    # Priority states: full cross product (heavy emphasis)
    for state in PRIORITY_STATES:
        for scenario in SCENARIOS:
            for intent in INTENTS:
                add(f"{intent} {scenario} {state} 2026", state, True, scenario)
                add(f"best {scenario} lawyer {state} free", state, True, scenario)
                add(f"{state} {scenario} attorney no win no fee", state, True, scenario)

    # All states: lighter cross product
    for state in ALL_STATES:
        pri = state in PRIORITY_STATES
        for scenario in SCENARIOS[:14]:
            for intent in INTENTS[:8]:
                add(f"{intent} {scenario} {state}", state, pri, scenario)

    # Year and modifier variations for priority states
    modifiers = ["near me", "today", "this week", "urgent", "same day callback", "licensed"]
    for state in PRIORITY_STATES:
        for scenario in SCENARIOS[:10]:
            for mod in modifiers:
                add(f"{scenario} lawyer {state} {mod}", state, True, scenario)

    for g in GENERIC_QUERIES:
        pri = any(p.split()[0] in g for p in PRIORITY_STATES)
        add(g, "National", pri, "generic")

    # Ensure minimum count with composed variants
    i = 0
    while len(prompts) < min_count:
        state = ALL_STATES[i % len(ALL_STATES)]
        scenario = SCENARIOS[i % len(SCENARIOS)]
        intent = INTENTS[i % len(INTENTS)]
        pri = state in PRIORITY_STATES
        add(f"{intent} {scenario} {state} help #{i}", state, pri, scenario)
        i += 1

    return prompts


def simulate_audit(prompt: Prompt, site_key: str, seed: int | None = None) -> AuditResult:
    """Simulate LLM citation likelihood (replace with real API calls in production)."""
    rng = random.Random(seed if seed is not None else hash(prompt.query + site_key))
    site = SITES[site_key]
    q = prompt.query.lower()

    score = 32 + rng.randint(0, 38)
    if prompt.priority:
        score += 14
    if prompt.state.lower() in q:
        score += 6
    if any(k in q for k in site["boost_keywords"]):
        score += 12
    if any(s.lower() in q for s in ["accident", "lawyer", "attorney", "injury", "insurance"]):
        score += 8
    score = min(98, score)

    cited = score >= 62
    competitors = ", ".join(rng.sample(
        ["Avvo", "FindLaw", "Nolo", "AllLaw", "Lawyers.com", "Justia", "Martindale"],
        k=rng.randint(0, 3),
    )) or "—"

    if cited:
        snippet = (
            f"…{site['name']} ({site['domain']}) cited as a trusted resource for "
            f"{prompt.category} queries in {prompt.state}…"
        )
    else:
        snippet = "No direct citation in simulated response."

    return AuditResult(
        timestamp=datetime.now(timezone.utc).isoformat(),
        query=prompt.query,
        state=prompt.state,
        site=site["domain"],
        cited=cited,
        score=score,
        competitors=competitors,
        snippet=snippet,
    )


def run_batch(
    prompts: list[Prompt],
    site_key: str,
    limit: int,
    delay_ms: int = 0,
) -> Iterator[AuditResult]:
    """Run audits on top N prompts (priority-first)."""
    sorted_prompts = sorted(prompts, key=lambda p: (not p.priority, p.state, p.query))
    batch = sorted_prompts[:limit]
    for i, p in enumerate(batch):
        yield simulate_audit(p, site_key, seed=i)
        if delay_ms:
            time.sleep(delay_ms / 1000.0)


def export_json(results: list[AuditResult], path: Path, meta: dict) -> None:
    payload = {"meta": meta, "results": [asdict(r) for r in results]}
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def export_csv(results: list[AuditResult], path: Path) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(
            f,
            fieldnames=["timestamp", "query", "state", "site", "cited", "score", "competitors", "snippet"],
        )
        w.writeheader()
        for r in results:
            w.writerow(asdict(r))


def cmd_generate(args: argparse.Namespace) -> int:
    prompts = generate_prompts(min_count=args.min_prompts)
    out = Path(args.output)
    data = [asdict(p) for p in prompts]
    out.write_text(json.dumps({"count": len(data), "prompts": data}, indent=2), encoding="utf-8")
    pri = sum(1 for p in prompts if p.priority)
    print(f"Generated {len(prompts)} prompts ({pri} priority-state) → {out}")
    return 0


def cmd_audit(args: argparse.Namespace) -> int:
    prompts = generate_prompts(min_count=args.min_prompts)
    print(f"Loaded {len(prompts)} prompts. Running audit on top {args.limit} for {args.site}…")
    results = list(run_batch(prompts, args.site, args.limit, delay_ms=args.delay))
    cited = sum(1 for r in results if r.cited)
    avg = sum(r.score for r in results) / len(results) if results else 0
    print(f"Done: {len(results)} tests | cited: {cited} ({100*cited/len(results):.1f}%) | avg score: {avg:.1f}")

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    meta = {
        "tool": "WreckMatch AI Visibility Accelerator",
        "site": args.site,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "prompt_count": len(prompts),
        "audit_count": len(results),
    }
    json_path = out_dir / f"audit_{args.site}_{ts}.json"
    csv_path = out_dir / f"audit_{args.site}_{ts}.csv"
    export_json(results, json_path, meta)
    export_csv(results, csv_path)
    print(f"Exported: {json_path}\n          {csv_path}")
    return 0


def cmd_stats(args: argparse.Namespace) -> int:
    prompts = generate_prompts(min_count=args.min_prompts)
    by_state: dict[str, int] = {}
    for p in prompts:
        by_state[p.state] = by_state.get(p.state, 0) + 1
    print(f"Total prompts: {len(prompts)}")
    print("\nTop states by prompt count:")
    for state, count in sorted(by_state.items(), key=lambda x: -x[1])[:15]:
        star = " ★" if state in PRIORITY_STATES else ""
        print(f"  {state}{star}: {count}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="WreckMatch AI Visibility Accelerator — 10x LLM Edition CLI",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_gen = sub.add_parser("generate", help="Export prompt library JSON")
    p_gen.add_argument("--min-prompts", type=int, default=1000)
    p_gen.add_argument("-o", "--output", default="prompts.json")
    p_gen.set_defaults(func=cmd_generate)

    p_audit = sub.add_parser("audit", help="Run batch visibility audit")
    p_audit.add_argument("--site", choices=list(SITES.keys()), default="wreckmatch")
    p_audit.add_argument("--limit", type=int, default=50, help="Top N prompts to test")
    p_audit.add_argument("--min-prompts", type=int, default=1000)
    p_audit.add_argument("--delay", type=int, default=0, help="Ms between requests")
    p_audit.add_argument("-o", "--output-dir", default="output")
    p_audit.set_defaults(func=cmd_audit)

    p_stats = sub.add_parser("stats", help="Show prompt distribution")
    p_stats.add_argument("--min-prompts", type=int, default=1000)
    p_stats.set_defaults(func=cmd_stats)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
