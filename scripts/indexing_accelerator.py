#!/usr/bin/env python3
"""
IndexNow submissions per https://www.indexnow.org/documentation

Option 1 (recommended): host UTF-8 file at https://www.wreckmatch.com/{key}.txt
with the key as the only content (served via next.config rewrite -> /api/indexnow-key).

Usage:
  python scripts/indexing_accelerator.py
  python scripts/indexing_accelerator.py --verify-key
  python scripts/indexing_accelerator.py --url https://www.wreckmatch.com/what-to-do-after-a-car-accident
  python scripts/indexing_accelerator.py --new-slugs my-post-slug --from-git HEAD~1
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = os.getenv("WRECKMATCH_SITE", "https://www.wreckmatch.com").rstrip("/")
HOST = SITE.replace("https://", "").replace("http://", "")
LOG_PATH = ROOT / "content/autopilot/indexing_log.jsonl"
BLOG_DIR = ROOT / "content/blog"

INDEXNOW_ENDPOINTS = (
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
)

KEY_PATTERN = re.compile(r"^[a-zA-Z0-9-]{8,128}$")

# HTML pages only (no .xml / .txt - IndexNow may return 422)
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
]


def log(msg: str) -> None:
    print(msg, flush=True)


def validate_key(key: str) -> str | None:
    if not KEY_PATTERN.match(key):
        return (
            "INDEXNOW_KEY must be 8-128 characters (a-z, A-Z, 0-9, hyphen only). "
            "Generate: openssl rand -hex 16"
        )
    return None


def filter_urls(urls: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for raw in urls:
        if not raw.startswith("http"):
            continue
        lower = raw.lower()
        if any(lower.endswith(ext) for ext in (".xml", ".txt", ".json")):
            continue
        try:
            parsed = urllib.parse.urlparse(raw)
            if parsed.hostname not in (HOST, f"www.{HOST}") and HOST not in (parsed.hostname or ""):
                continue
        except Exception:
            continue
        if raw not in seen:
            seen.add(raw)
            out.append(raw)
    return out[:10_000]


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
    return [f"{SITE}/blog/{Path(line.strip()).stem}" for line in out.splitlines() if line.strip().endswith(".md")]


def build_url_list(new_slugs: list[str], from_git: str | None, recent_limit: int) -> list[str]:
    urls = [f"{SITE}{p}" for p in PRIORITY_PATHS]
    urls.extend(f"{SITE}/blog/{s}" for s in new_slugs if s)
    if from_git:
        urls.extend(urls_from_git_diff(from_git))
    urls.extend(collect_recent_blog_urls(recent_limit))
    return filter_urls(urls)


def verify_key_file(key: str) -> dict:
    url = f"{SITE}/{key}.txt"
    try:
        with urllib.request.urlopen(url, timeout=20) as resp:
            body = resp.read().decode("utf-8").strip()
            status = resp.status
    except Exception as e:
        return {"url": url, "ok": False, "error": str(e)}
    ok = body == key and status == 200
    return {
        "url": url,
        "ok": ok,
        "status": status,
        "bodyMatchesKey": body == key,
        "hint": None
        if ok
        else "File must contain ONLY the key (Option 1). Set INDEXNOW_KEY on Vercel and redeploy.",
    }


def submit_single(url: str, key: str) -> list[dict]:
    encoded = urllib.parse.quote(url, safe="")
    results = []
    for base in INDEXNOW_ENDPOINTS:
        req_url = f"{base}?url={encoded}&key={urllib.parse.quote(key, safe='')}"
        try:
            with urllib.request.urlopen(req_url, timeout=30) as resp:
                results.append({"endpoint": base, "status": resp.status, "ok": resp.status in (200, 202)})
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:300]
            results.append(
                {"endpoint": base, "status": e.code, "ok": e.code in (200, 202), "body": body}
            )
        except Exception as e:
            results.append({"endpoint": base, "ok": False, "error": str(e)})
    return results


def submit_batch(urls: list[str], key: str) -> dict:
    # Option 1: root key file — omit keyLocation per IndexNow recommendation
    payload = json.dumps({"host": HOST, "key": key, "urlList": urls}).encode("utf-8")
    results = []
    for endpoint in INDEXNOW_ENDPOINTS:
        req = urllib.request.Request(
            endpoint,
            data=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                results.append({"endpoint": endpoint, "status": resp.status, "ok": resp.status in (200, 202)})
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:300]
            results.append(
                {
                    "endpoint": endpoint,
                    "status": e.code,
                    "ok": e.code in (200, 202),
                    "body": body,
                    "meaning": {
                        403: "Key invalid or key file missing/wrong content",
                        422: "URL not on host or bad key format",
                        429: "Too many requests — slow down",
                    }.get(e.code),
                }
            )
        except Exception as e:
            results.append({"endpoint": endpoint, "ok": False, "error": str(e)})
    return {"keyFile": f"{SITE}/{key}.txt", "urlCount": len(urls), "results": results}


def append_log(entry: dict) -> None:
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")


def main() -> int:
    p = argparse.ArgumentParser(description="WreckMatch IndexNow (official protocol)")
    p.add_argument("--new-slugs", nargs="*", default=[])
    p.add_argument("--from-git", default="")
    p.add_argument("--recent", type=int, default=150)
    p.add_argument("--url", default="", help="Submit one URL via GET (test)")
    p.add_argument("--verify-key", action="store_true", help="Check key file on live site")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    key = os.getenv("INDEXNOW_KEY", "").strip()
    if args.verify_key:
        if not key:
            log("Set INDEXNOW_KEY first")
            return 1
        err = validate_key(key)
        if err:
            log(err)
            return 1
        v = verify_key_file(key)
        log(json.dumps(v, indent=2))
        return 0 if v.get("ok") else 1

    if args.url:
        if not key:
            log("INDEXNOW_KEY not set")
            return 1
        err = validate_key(key)
        if err:
            log(err)
            return 1
        v = verify_key_file(key)
        if not v.get("ok"):
            log("Fix key file before submitting URLs:")
            log(json.dumps(v, indent=2))
            return 1
        results = submit_single(args.url, key)
        log(json.dumps(results, indent=2))
        return 0 if any(r.get("ok") for r in results) else 1

    urls = build_url_list(args.new_slugs, args.from_git or None, args.recent)
    log(f"Collected {len(urls)} HTML URLs for IndexNow")
    if args.dry_run:
        for u in urls[:25]:
            log(f"  {u}")
        return 0

    entry: dict = {"at": datetime.now(timezone.utc).isoformat(), "urlCount": len(urls)}

    if not key:
        entry["note"] = "INDEXNOW_KEY not set - see docs/INDEXING_AUTOMATION.md"
        log(entry["note"])
        append_log(entry)
        return 0

    err = validate_key(key)
    if err:
        log(err)
        return 1

    v = verify_key_file(key)
    entry["keyVerification"] = v
    if not v.get("ok"):
        log("Key file not valid on live site — deploy INDEXNOW_KEY to Vercel first:")
        log(json.dumps(v, indent=2))
        append_log(entry)
        return 1

    entry["indexnow"] = submit_batch(urls, key)
    ok = any(r.get("ok") for r in entry["indexnow"]["results"])
    log(f"IndexNow batch: {entry['indexnow']['urlCount']} URLs -> key file {entry['indexnow']['keyFile']}")
    for r in entry["indexnow"]["results"]:
        log(f"  {r}")
    append_log(entry)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
