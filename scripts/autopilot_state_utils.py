#!/usr/bin/env python3
"""Shared helpers for 50 cities × 50 states daily SLA."""
from __future__ import annotations

import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_state_names() -> list[str]:
    cities_ts = ROOT / "lib" / "cities.ts"
    if not cities_ts.exists():
        return []
    text = cities_ts.read_text(encoding="utf-8")
    states = set(re.findall(r'"state":\s*"([^"]+)"', text))
    return sorted(s for s in states if s not in ("United States", ""))


def state_from_slug(slug: str, state_names: list[str] | None = None) -> str | None:
    state_names = state_names or load_state_names()
    s = (slug or "").lower()
    for st in sorted(state_names, key=len, reverse=True):
        st_slug = st.lower().replace(" ", "-")
        if s.endswith("-" + st_slug) or f"-{st_slug}-" in s:
            return st
    return None


def slugs_published_on(day: str, log_path: Path) -> list[str]:
    if not log_path.exists():
        return []
    slugs: list[str] = []
    for line in log_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        if not line.startswith(f"[{day}") or "Published " not in line:
            continue
        if "/content/blog/" not in line or "/es/" in line:
            continue
        m = re.search(r"content/blog/([^]\s]+\.md)", line)
        if m:
            slugs.append(m.group(1).replace(".md", ""))
    return slugs


def states_published_on(day: str, log_path: Path) -> set[str]:
    names = load_state_names()
    out: set[str] = set()
    for slug in slugs_published_on(day, log_path):
        st = state_from_slug(slug, names)
        if st:
            out.add(st)
    return out
