#!/usr/bin/env python3
"""
Generate copy-paste viral/social packs from latest blog syndication (no posting API needed).

Output: content/autopilot/viral_queue/{slug}_viral.md
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SYNDICATION = ROOT / "content/syndication"
OUT = ROOT / "content/autopilot/viral_queue"
SITE = "https://www.wreckmatch.com"
PHONE = "855 WRECKMATCH (855) 897-3256"


def load_packs(limit: int) -> list[dict]:
    latest = SYNDICATION / "latest.json"
    files = sorted(SYNDICATION.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    packs: list[dict] = []
    seen: set[str] = set()
    for f in files:
        if f.name == "latest.json":
            continue
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            slug = data.get("slug", "")
            if slug and slug not in seen:
                seen.add(slug)
                packs.append(data)
        except json.JSONDecodeError:
            continue
        if len(packs) >= limit:
            break
    if latest.exists() and len(packs) < limit:
        try:
            data = json.loads(latest.read_text(encoding="utf-8"))
            if data.get("slug") and data["slug"] not in seen:
                packs.insert(0, data)
        except json.JSONDecodeError:
            pass
    return packs[:limit]


def viral_md(data: dict) -> str:
    slug = data.get("slug", "post")
    url = data.get("url", f"{SITE}/blog/{slug}")
    title = data.get("title", slug)
    vertical = data.get("vertical", "auto")
    hook = (
        "Insurers call within HOURS after a crash. Here's what NOT to do."
        if vertical != "truck"
        else "Semi crash? Black box data disappears in days. Preserve evidence NOW."
    )
    return f"""# Viral content pack — {title}

**URL:** {url}  
**Generated:** {datetime.now(timezone.utc).isoformat()}  
**Copy-paste only — film/post when ready**

---

## TikTok / Reels / Shorts (30–45 sec)

**Hook (on camera):** "{hook}"

**Points:**
1. Call 911 if anyone is hurt — photos + witnesses.
2. Medical care within 24 hours (even if you feel fine).
3. Do NOT give a recorded statement to the other insurer today.
4. Free attorney matching in ~60 seconds — not a law firm, no upfront fee.

**CTA on screen:** wreckmatch.com · {PHONE}

**Hashtags:** #caraccident #injurylaw #truckaccident #legalhelp #wreckmatch

---

## YouTube Shorts title + description

**Title:** {title[:90]}

**Description:**
{data.get('linkedin', data.get('facebook', ''))[:500]}

Read the full guide: {url}
Free matching: {SITE}/#form · {PHONE}

---

## X / Twitter thread (3 tweets)

**1/** {data.get('twitter', hook)[:270]}

**2/** WreckMatch connects crash victims with 800+ participating law firms — free matching, not a law firm. Educational only.

**3/** Full guide → {url}

---

## LinkedIn (paste)

{data.get('linkedin', '')}

---

## Facebook

{data.get('facebook', '')}

---

## Reddit (helpful comment — follow sub rules)

{data.get('reddit_body', '')}

---

## Pinterest pin

**Title:** {title[:100]}  
**Desc:** Free crash victim guide — steps, insurance traps, attorney matching. {url}
"""


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--limit", type=int, default=6)
    p.add_argument("--slug", default="")
    args = p.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    packs = load_packs(args.limit)
    if args.slug:
        f = SYNDICATION / f"{args.slug}.json"
        if f.exists():
            packs = [json.loads(f.read_text(encoding="utf-8"))]

    for data in packs:
        slug = data.get("slug", "unknown")
        out = OUT / f"{slug}_viral.md"
        out.write_text(viral_md(data), encoding="utf-8")
        print(f"wrote {out}")

    index = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "packs": [d.get("slug") for d in packs],
    }
    (OUT / "index.json").write_text(json.dumps(index, indent=2), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
