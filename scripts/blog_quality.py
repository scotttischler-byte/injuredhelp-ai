#!/usr/bin/env python3
"""Shared blog quality scoring for gate, autopilot, and upgrade scripts."""
from __future__ import annotations

import re
from dataclasses import dataclass, field


DISCLAIMER_MARKERS = (
    "not legal advice",
    "not a law firm",
    "referral service",
)
NETWORK_MARKERS = ("800+", "800 ", "participating law firms", "participating attorneys")


@dataclass
class QualityReport:
    slug: str
    score: int
    tier: str
    issues: list[str] = field(default_factory=list)
    word_count: int = 0

    @property
    def ok_to_publish(self) -> bool:
        return self.score >= 85 and "broken_frontmatter" not in self.issues


def parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    fm: dict[str, str] = {}
    for line in parts[1].strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip('"')
    return fm, parts[2]


def word_count(body: str) -> int:
    text = re.sub(r"```[\s\S]*?```", "", body)
    text = re.sub(r"\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"[#*|_>`\-]", " ", text)
    return len([w for w in text.split() if w.strip()])


def score_post(slug: str, text: str) -> QualityReport:
    issues: list[str] = []
    score = 100

    if "---#" in text or text.count("---") < 2:
        issues.append("broken_frontmatter")
        return QualityReport(slug=slug, score=0, tier="fail", issues=issues)

    fm, body = parse_frontmatter(text)
    wc = word_count(body)

    if re.search(r"texas-style", text, re.I):
        state = fm.get("state", "")
        if state.lower() != "texas":
            issues.append("texas_style_excerpt")
            score -= 40

    if not all(m in text.lower() for m in DISCLAIMER_MARKERS):
        issues.append("missing_disclaimer")
        score -= 25

    if not any(m in text.lower() for m in NETWORK_MARKERS):
        issues.append("missing_network_line")
        score -= 15

    is_autopilot = "autopilot: true" in text
    if is_autopilot and wc < 2000:
        issues.append("below_2000_words")
        score -= min(60, max(10, (2000 - wc) // 25))
    elif wc < 500:
        if is_autopilot and wc >= 380:
            issues.append("thin_source_expandable")
            score -= 5
        else:
            issues.append("thin_body")
            score -= 20 if wc < 400 else 10

    excerpt = fm.get("excerpt", "")
    if len(excerpt) < 40:
        issues.append("weak_excerpt")
        score -= 10

    state = fm.get("state", "")
    if state and state.lower() not in ("general", "national", "united states", ""):
        if state.lower() not in excerpt.lower():
            issues.append("excerpt_state_mismatch")
            score -= 5

    if "wrongful-death" in slug:
        first_steps = body.lower().split("## what should you do first", 1)
        if len(first_steps) > 1 and "dot numbers" in first_steps[1][:400]:
            issues.append("wrongful_death_truck_steps")
            score -= 15

    if "wreckmatch.com" not in body.lower() and "/#form" not in body:
        issues.append("missing_cta")
        score -= 10

    if fm.get("qualityTier", "").lower() == "gold" and fm.get("authorId") == "scott-tischler":
        if "judge roy waddell" not in text.lower():
            issues.append("missing_roy_review")
            score -= 3

    score = max(0, min(100, score))
    gold_prose = wc >= 2000 or (fm.get("qualityTier", "").lower() == "gold" and wc >= 1800)
    tier = (
        "gold"
        if score >= 95 and gold_prose
        else "pass"
        if score >= 85
        else "revise"
    )
    return QualityReport(slug=slug, score=score, tier=tier, issues=issues, word_count=wc)
