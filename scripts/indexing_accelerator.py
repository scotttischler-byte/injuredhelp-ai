#!/usr/bin/env python3
"""
Notify search engines about new/updated WreckMatch URLs.

Google does NOT offer a public API for the GSC "Request indexing" button on
general pages (only JobPosting/BroadcastEvent via Indexing API). This script
uses IndexNow (Bing, Yandex, etc.) + sitemap refresh hints + a priority URL list.

Usage:
  python scripts/indexing_accelerator.py
  python scripts/indexing_accelerator.py --new-slugs semi-truck-accident-in-houston
  python scripts/indexing_accelerator.py --from-git HEAD~1
  INDEXNOW_KEY=your-key python scripts/indexing_accelerator.py
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = os.getenv("WRECKMATCH_SITE", "https://www.wreckmatch.com").rstrip("/")
HOST = SITE.replace("https://", "").replace("http://", "")
LOG_PATH = ROOT / "content/autopilot/indexing_log.jsonl"
BLOG_DIR = ROOT / "content/blog"

# Always ping these (money + pillar pages)
PRIORITY_PATHS = [
    "/",
    "/what-to-do-after-a-car-accident",
    "/what-to-do-after-a-car-accident-in-texas",
    "/what-to-do-after-a-car-accident-in-california",
    "/what-to-do-after-a-car-accident-in-florida",
    "/what-to-do-after-a-car-accident-in-new-york",
    "/car-accident-help",
    "/truck-accident-help",
    "/car-accident-help-texas",
    "/car-accident-help-houston",
    "/car-accident-help-dallas",
    "/car-accident-help-san-antonio",
    "/car-accident-help-austin",
    "/car-accident-help-miami",
    "/car-accident-help-los-angeles",
    "/car-accident-help-new-york-city",
    "/checklist-after-car-accident",
    "/ai-accident-help",
    "/resources",
    "/blog",
    "/sitemap.xml",
    "/llms.txt",
]


def log(msg: str) -> None:
    print(msg, flush=True)


def slugify_city(city: str) -> str:
    import re

    s = city.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def state_what_to_do_path(state: str) -> str | None:
    m = {
        "texas": "/what-to-do-after-a-car-accident-in-texas",
        "california": "/what-to-do-after-a-car-accident-in-california",
        "florida": "/what-to-do-after-a-car-accident-in-florida",
        "new york": "/what-to-do-after-a-car-accident-in-new-york",
    }
    return m.get(state.lower().strip())


def collect_recent_blog_urls(limit: int = 200) -> list[str]:
    if not BLOG_DIR.is_dir():
        return []
    posts = sorted(BLOG_DIR.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True)
    return [f"{SITE}/blog/{p.stem}" for p in posts[:limit]]


def urls_from_git_diff(ref: str) -> list[str]:
    try:
        out = subprocess.check_output(
            ["git", "diff", "--name-only", ref, "HEAD", "--", "content/blog"],
            cwd=ROOT,
            text=True,
        )
    except subprocess.CalledProcessError:
        return []
    urls = []
    for line in out.splitlines():
        line = line.strip()
        if line.endswith(".md") and "/blog/" in line.replace("\\", "/"):
            slug = Path(line).stem
            urls.append(f"{SITE}/blog/{slug}")
    return urls


def build_url_list(new_slugs: list[str], from_git: str | None, recent_limit: int) -> list[str]:
    urls: list[str] = [f"{SITE}{p}" for p in PRIORITY_PATHS]
    for slug in new_slugs:
        urls.append(f"{SITE}/blog/{slug}")
    if from_git:
        urls.extend(urls_from_git_diff(from_git))
    urls.extend(collect_recent_blog_urls(recent_limit))
    # dedupe preserve order
    seen: set[str] = set()
    out: list[str] = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out[:10_000]


def submit_indexnow(urls: list[str], key: str) -> dict:
    key_location = f"{SITE}/{key}.txt"
    payload = json.dumps(
        {"host": HOST, "key": key, "keyLocation": key_location, "urlList": urls}
    ).encode("utf-8")
    endpoints = [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow",
    ]
    results = []
    for endpoint in endpoints:
        req = urllib.request.Request(
            endpoint,
            data=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                results.append({"endpoint": endpoint, "status": resp.status, "ok": True})
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:300]
            results.append(
                {"endpoint": endpoint, "status": e.code, "ok": e.code in (200, 202), "body": body}
            )
        except Exception as e:
            results.append({"endpoint": endpoint, "ok": False, "error": str(e)})
    return {"keyLocation": key_location, "urlCount": len(urls), "results": results}


def append_log(entry: dict) -> None:
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")


def main() -> int:
    p = argparse.ArgumentParser(description="WreckMatch indexing accelerator (IndexNow)")
    p.add_argument("--new-slugs", nargs="*", default=[], help="Blog slugs published this run")
    p.add_argument("--from-git", default="", help="Git ref to diff for new blog files (e.g. HEAD~1)")
    p.add_argument("--recent", type=int, default=150, help="Recent blog URLs to include")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    key = os.getenv("INDEXNOW_KEY", "").strip()
    urls = build_url_list(args.new_slugs, args.from_git or None, args.recent)

    log(f"Collected {len(urls)} URLs for indexing signals")
    if args.dry_run:
        for u in urls[:20]:
            log(f"  {u}")
        if len(urls) > 20:
            log(f"  ... and {len(urls) - 20} more")
        return 0

    entry: dict = {
        "at": datetime.now(timezone.utc).isoformat(),
        "urlCount": len(urls),
        "indexnow": None,
        "note": None,
    }

    if not key:
        entry["note"] = (
            "INDEXNOW_KEY not set — add key in Vercel + GitHub secrets. "
            "Register at https://www.bing.com/indexnow"
        )
        log(entry["note"])
        append_log(entry)
        return 0

    result = submit_indexnow(urls, key)
    entry["indexnow"] = result
    ok = any(r.get("ok") for r in result["results"])
    log(f"IndexNow submitted {result['urlCount']} URLs (key at {result['keyLocation']})")
    for r in result["results"]:
        log(f"  {r['endpoint']}: {'ok' if r.get('ok') else r}")

    append_log(entry)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
