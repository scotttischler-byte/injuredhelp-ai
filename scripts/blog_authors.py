"""Mirror lib/blog-authors.ts for Python fix/upgrade scripts."""
from __future__ import annotations

import re


def kathy_third(slug: str) -> bool:
    n = sum(ord(ch) for ch in slug.lower())
    return n % 3 == 0


SCOTT_TOPICS = [
    re.compile(r"(statute-of-limitations|deadline|time-limit|filing-window|how-long)", re.I),
    re.compile(r"(insurance|adjuster|claim|denied|low-ball|recorded-statement|settlement)", re.I),
    re.compile(r"(fault|liability|comparative|contributory|negligence)", re.I),
    re.compile(r"(courtroom|deposition|discovery|trial|hearing)", re.I),
    re.compile(
        r"(18-wheeler|semi-truck|tractor-trailer|fmcsa|jackknife|underride|override|black-box|truck-accident)",
        re.I,
    ),
    re.compile(r"(rideshare|uber|lyft|gig-driver)", re.I),
    re.compile(r"(motorcycle|motorbike|biker)", re.I),
    re.compile(r"(mistakes|costly|7-|top-|guide-|wreckmatch|fmcsa|black-box)", re.I),
]

KATHY_OR_SCOTT_TOPICS = [
    re.compile(r"(wrongful-death|fatal|family-guide)", re.I),
    re.compile(r"(catastrophic|severe-injury|critical-injury|life-altering|paralysis)", re.I),
    re.compile(r"severe-injury-after-a-car-accident", re.I),
    re.compile(r"(traumatic-brain|brain-injury|tbi|concussion|head-injury)", re.I),
    re.compile(r"(spinal|spinal-cord|herniated)", re.I),
    re.compile(r"(pedestrian|crosswalk|hit-by-car|walking)", re.I),
    re.compile(
        r"(what-to-do|first-steps|after-a-crash|after-a-car|immediate|on-scene|police-report|documentation)",
        re.I,
    ),
    re.compile(r"(recovery|treatment|hospital|er-visit|physical-therapy|medical)", re.I),
    re.compile(r"(whiplash|neck-injury|back-injury|soft-tissue|chiropractor)", re.I),
]


def author_id_for_slug(slug: str) -> str:
    s = (slug or "").lower()
    for pat in SCOTT_TOPICS:
        if pat.search(s):
            return "scott-tischler"
    for pat in KATHY_OR_SCOTT_TOPICS:
        if pat.search(s):
            return "kathy-carr" if kathy_third(slug) else "scott-tischler"
    return "scott-tischler"


def author_display(author_id: str) -> str:
    return "Kathy Carr" if author_id == "kathy-carr" else "Scott Tischler"


def author_title(author_id: str) -> str:
    return "CEO & Co-Founder" if author_id == "kathy-carr" else "Co-Founder & SVP Marketing"
