#!/usr/bin/env python3
"""Fix WreckMatch/car-accident copy in SemiTruckMatch blog base sections (before re-materialize)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "sites/semitruckmatch/content/blog"
SITE = "https://www.semitruckmatch.com"


def patch(text: str) -> str:
    text = text.replace("via WreckMatch.", f"via SemiTruckMatch.")
    text = text.replace("via WreckMatch,", "via SemiTruckMatch,")
    text = re.sub(
        r"WreckMatch connects you with participating \*\*licensed\*\* attorneys",
        "SemiTruckMatch connects you with participating **licensed** truck accident attorneys",
        text,
    )
    text = text.replace("| WreckMatch matching fee |", "| SemiTruckMatch matching fee |")
    text = text.replace("### Is WreckMatch a law firm?", "### Is SemiTruckMatch a law firm?")
    text = text.replace(
        "No. WreckMatch LLC is a **legal referral service** — not a law firm. We connect injured people with participating attorneys who handle **car, truck, and catastrophic injury** cases",
        "No. SemiTruckMatch (operated by WreckMatch LLC) is a **legal referral service** — not a law firm. We connect injured people with participating attorneys who handle **truck and catastrophic injury** cases",
    )
    text = re.sub(
        r"\[([^\]]+) car accident help\]\(([^)]+)\)",
        lambda m: f"[{m.group(1).replace(' car accident', ' truck accident')}]({m.group(2).replace('car-accident-help-', 'car-accident-help/') if 'car-accident-help-' in m.group(2) else m.group(2)})",
        text,
    )
    text = text.replace(
        "car accident victims in ",
        "semi-truck crash victims in ",
    )
    text = text.replace(
        "Educational guide for ",
        "FMCSA-aware educational guide for ",
        1,
    )
    text = text.replace(
        f"[National what-to-do guide]({SITE}/what-to-do-after-a-car-accident)",
        f"[National truck crash guide]({SITE}/truck-accident-help)",
    )
    return text


def main() -> None:
    n = 0
    for path in list(BLOG.glob("*.md")) + list((BLOG / "es").glob("*.md")):
        raw = path.read_text(encoding="utf-8")
        updated = patch(raw)
        if updated != raw:
            path.write_text(updated, encoding="utf-8")
            n += 1
    print(f"Patched {n} markdown files under {BLOG}")


if __name__ == "__main__":
    main()
