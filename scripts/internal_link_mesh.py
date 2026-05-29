#!/usr/bin/env python3
"""
Strengthen internal links on blog posts (SEO + crawl depth). No API keys required.

Adds or extends ## Related resources with geo hubs, state guides, and related blog posts.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "content/blog"
SITE = "https://www.wreckmatch.com"

STATE_SLUGS = {
    "texas": "Texas",
    "california": "California",
    "florida": "Florida",
    "new-york": "New York",
    "colorado": "Colorado",
    "georgia": "Georgia",
    "illinois": "Illinois",
    "tennessee": "Tennessee",
    "alabama": "Alabama",
    "washington": "Washington",
    "ohio": "Ohio",
    "pennsylvania": "Pennsylvania",
    "north-carolina": "North Carolina",
    "arizona": "Arizona",
}


def parse_slug_geo(slug: str) -> tuple[str | None, str | None]:
    """Extract city-ish token and state slug from blog filename."""
    lower = slug.lower()
    state = None
    for st in sorted(STATE_SLUGS, key=len, reverse=True):
        if f"-{st}" in lower or lower.endswith(f"-{st}"):
            state = st
            break
    city = None
    states_alt = "|".join(re.escape(k) for k in STATE_SLUGS)
    m = re.search(rf"-in-([a-z0-9-]+)-(?:{states_alt}|20\d{{2}})", lower)
    if m:
        city = m.group(1)
    return city, state


def related_slugs(slug: str, state: str | None, limit: int = 4) -> list[str]:
    if not BLOG.is_dir():
        return []
    peers: list[tuple[int, str]] = []
    for p in BLOG.glob("*.md"):
        s = p.stem
        if s == slug:
            continue
        score = 0
        if state and state in s:
            score += 3
        if any(k in s for k in ("truck", "semi", "18-wheeler")) and any(
            k in slug for k in ("truck", "semi", "18-wheeler")
        ):
            score += 2
        if any(k in s for k in ("wrongful", "severe", "catastrophic", "brain", "spinal")) and any(
            k in slug for k in ("wrongful", "severe", "catastrophic", "brain", "spinal")
        ):
            score += 2
        if score > 0:
            peers.append((score, s))
    peers.sort(key=lambda x: (-x[0], x[1]))
    return [s for _, s in peers[:limit]]


def build_footer(slug: str) -> str:
    city, state = parse_slug_geo(slug)
    lines = [
        "",
        "---",
        "",
        "## Related resources",
        "",
        f"- [What to do after a car accident (national)]({SITE}/what-to-do-after-a-car-accident)",
    ]
    if state:
        st_name = STATE_SLUGS.get(state, state.replace("-", " ").title())
        lines.append(
            f"- [What to do after a crash in {st_name}]({SITE}/what-to-do-after-a-car-accident-in-{state})"
        )
        hub = "/car-accident-help-texas" if state == "texas" else f"/car-accident-help-{state}"
        lines.append(f"- [{st_name} car accident help hub]({SITE}{hub})")
    if city:
        place = city.replace(" ", "-")
        lines.append(f"- [{city.replace('-', ' ').title()} local help hub]({SITE}/car-accident-help-{place})")
    for rs in related_slugs(slug, state):
        title = rs.replace("-", " ").replace("  ", " ").title()[:72]
        lines.append(f"- [{title}]({SITE}/blog/{rs})")
    lines.extend(
        [
            f"- [Spanish version / versión en español]({SITE}/es/blog/{slug})",
            f"- [Free attorney matching →]({SITE}/#form)",
            "",
        ]
    )
    return "\n".join(lines)


def mesh_file(path: Path, *, dry_run: bool) -> bool:
    raw = path.read_text(encoding="utf-8")
    slug = path.stem
    footer = build_footer(slug)
    if "## Related resources" in raw:
        # Append related blog links if section exists but thin
        if raw.count("/blog/") < 2 and "versión en español" not in raw:
            raw = raw.rstrip() + "\n" + "\n".join(
                line
                for line in footer.splitlines()
                if line.startswith("- [") and "/blog/" in line
            ) + "\n"
            if not dry_run:
                path.write_text(raw, encoding="utf-8")
            return True
        return False
    new_body = raw.rstrip() + footer
    if not dry_run:
        path.write_text(new_body, encoding="utf-8")
    return True


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=80)
    p.add_argument("--slug", action="append", default=[])
    p.add_argument("--missing-only", action="store_true")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    paths = sorted(BLOG.glob("*.md"), key=lambda x: x.stat().st_mtime, reverse=True)
    if args.slug:
        paths = [BLOG / f"{s}.md" for s in args.slug if (BLOG / f"{s}.md").exists()]

    touched = 0
    for path in paths:
        if touched >= args.limit:
            break
        raw = path.read_text(encoding="utf-8")
        if args.missing_only and "## Related resources" in raw:
            continue
        if mesh_file(path, dry_run=args.dry_run):
            touched += 1
            print(f"{'would mesh' if args.dry_run else 'meshed'} {path.stem}")

    print(f"Done. {touched} posts.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
