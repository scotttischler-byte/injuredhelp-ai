#!/usr/bin/env python3
"""
GEO Secret Sauce — fully automated across all properties in config/geo-sites.json.

Runs:
  1. Multi-site IndexNow (pillars + recent EN/ES + pending slugs per brand)
  2. Live robots.txt / llms.txt / ai.txt audit per origin
  3. Top-priority blog GEO repair (materialize if missing FAQ/expansion markers)
  4. Optional Perplexity competitor citation monitor
  5. Ops checklist (GBP Q&A, Wikidata) in report

Usage:
  python3 scripts/geo_automation.py
  python3 scripts/geo_automation.py --index-only
  python3 scripts/geo_automation.py --site semitruckmatch
  python3 scripts/geo_automation.py --repair-blogs
  python3 scripts/geo_automation.py --notify-all-prod
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GEO_SITES_PATH = ROOT / "config/geo-sites.json"
REPORT_PATH = ROOT / "content/autopilot/geo_automation_report.json"
SECRETS_FILE = ROOT / ".secrets-setup"


def load_local_secrets() -> None:
    """Load .secrets-setup (CRON_SECRET, INDEXNOW_KEY) — same file as setup-traffic-machine.sh."""
    if not SECRETS_FILE.exists():
        return
    for line in SECRETS_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key, val = key.strip(), val.strip().strip('"').strip("'")
        if key and val and not os.getenv(key):
            os.environ[key] = val
    if not os.getenv("INDEXNOW_KEY"):
        os.environ.setdefault("INDEXNOW_KEY", "065536e9ab94b89a3451fd0f5ea4a193")

AI_AGENTS = ("GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended")

TOP_BLOG_SLUGS = [
    "what-to-do-after-a-car-accident-in-houston",
    "what-to-do-after-a-car-accident-in-dallas",
    "what-to-do-after-a-car-accident-in-los-angeles",
    "what-to-do-after-a-car-accident-in-miami",
    "what-to-do-after-a-car-accident-in-chicago",
    "what-to-do-after-a-car-accident-in-phoenix",
    "what-to-do-after-a-car-accident-in-atlanta",
    "what-to-do-after-a-car-accident-in-denver",
    "what-to-do-after-a-car-accident-in-seattle",
    "what-to-do-after-a-car-accident-in-boston",
]

TRUCK_TOP_SLUGS = [
    "semi-truck-accident-help-houston",
    "18-wheeler-crash-help-dallas",
    "truck-accident-help-texas",
    "fmcsa-truck-crash-evidence-guide",
    "what-to-do-after-semi-truck-accident-in-texas",
]


def log(msg: str) -> None:
    print(msg, flush=True)


def load_geo_sites(site_filter: str | None = None) -> list[dict]:
    data = json.loads(GEO_SITES_PATH.read_text(encoding="utf-8"))
    sites = [s for s in data.get("sites", []) if s.get("indexNow", True)]
    if site_filter:
        sites = [s for s in sites if s.get("id") == site_filter]
    return sites


def pending_path(site: dict) -> Path:
    rel = site.get("pendingPath") or "content/autopilot/indexnow_pending.json"
    return ROOT / rel


def load_pending(site: dict) -> list[str]:
    path = pending_path(site)
    if not path.exists():
        return []
    try:
        return list(json.loads(path.read_text(encoding="utf-8")).get("slugs") or [])
    except json.JSONDecodeError:
        return []


def clear_pending(site: dict) -> None:
    path = pending_path(site)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps({"slugs": [], "updatedAt": datetime.now(timezone.utc).isoformat()}, indent=2),
        encoding="utf-8",
    )


def blog_dirs_for_brand(brand: str) -> tuple[Path, Path]:
    if brand == "semitruckmatch":
        en = ROOT / "sites/semitruckmatch/content/blog"
        es = en / "es"
    else:
        en = ROOT / "content/blog"
        es = en / "es"
    return en, es


def collect_urls(site: dict, recent: int, extra_slugs: list[str]) -> list[str]:
    origin = site["origin"].rstrip("/")
    brand = site.get("brand", "wreckmatch")
    en_dir, es_dir = blog_dirs_for_brand(brand)
    seen: set[str] = set()
    urls: list[str] = []

    def add(u: str) -> None:
        if u not in seen:
            seen.add(u)
            urls.append(u)

    priority = [
        "/",
        "/blog",
        "/es/blog",
        "/states",
        "/llms.txt",
        "/llms-full.txt",
        "/ai.txt",
        "/truck-accident-help",
        "/car-accident-help",
        "/what-to-do-after-a-car-accident",
        "/for-attorneys",
        "/ai-accident-help",
        "/checklist-after-car-accident",
        "/secret-sauce.html",
    ]
    if brand != "semitruckmatch":
        priority.extend(
            [
                "/what-to-do-after-a-car-accident-in-texas",
                "/what-to-do-after-a-car-accident-in-california",
                "/what-to-do-after-a-car-accident-in-florida",
                "/car-accident-help-texas",
                "/car-accident-help-houston",
            ]
        )

    for p in priority:
        add(f"{origin}{p}")

    for slug in extra_slugs:
        add(f"{origin}/blog/{slug}")
        add(f"{origin}/es/blog/{slug}")

    for slug in load_pending(site):
        add(f"{origin}/blog/{slug}")
        add(f"{origin}/es/blog/{slug}")

    if en_dir.is_dir():
        posts = sorted(en_dir.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True)
        for p in posts[:recent]:
            add(f"{origin}/blog/{p.stem}")

    if es_dir.is_dir():
        posts = sorted(es_dir.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True)
        for p in posts[: min(recent, 200)]:
            add(f"{origin}/es/blog/{p.stem}")

    return urls[:10_000]


def submit_indexnow(origin: str, urls: list[str], key: str) -> dict:
    host = origin.replace("https://", "").replace("http://", "").split("/")[0]
    payload = json.dumps({"host": host, "key": key, "urlList": urls}).encode("utf-8")
    endpoints = (
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow",
        "https://yandex.com/indexnow",
    )
    results = []
    for endpoint in endpoints:
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
            results.append({"endpoint": endpoint, "status": e.code, "ok": e.code in (200, 202)})
        except Exception as e:
            results.append({"endpoint": endpoint, "ok": False, "error": str(e)})
    ok = any(r.get("ok") for r in results)
    return {"origin": origin, "urlCount": len(urls), "ok": ok, "results": results}


def fetch_text(url: str, timeout: int = 20) -> tuple[int | None, str]:
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")[:8000]
    except Exception as e:
        return None, str(e)


def audit_origin(origin: str) -> dict:
    origin = origin.rstrip("/")
    robots_status, robots_body = fetch_text(f"{origin}/robots.txt")
    llms_ok = False
    ai_ok = False
    st, _ = fetch_text(f"{origin}/llms.txt")
    llms_ok = st == 200
    st, _ = fetch_text(f"{origin}/ai.txt")
    ai_ok = st == 200
    allows_ai = robots_body and all(a in robots_body for a in AI_AGENTS[:3])
    sample_blog = f"{origin}/blog"
    st_blog, blog_body = fetch_text(sample_blog)
    has_table = "<table" in (blog_body or "").lower()
    has_faq_ld = "FAQPage" in (blog_body or "") or "faqpage" in (blog_body or "").lower()
    return {
        "origin": origin,
        "robotsStatus": robots_status,
        "allowsAiCrawlers": allows_ai,
        "llmsTxt": llms_ok,
        "aiTxt": ai_ok,
        "blogIndexStatus": st_blog,
        "blogSignals": {"tableOnIndex": has_table, "faqOnIndex": has_faq_ld},
    }


def blog_needs_geo_repair(path: Path) -> bool:
    if not path.exists():
        return False
    try:
        body = path.read_text(encoding="utf-8")
    except OSError:
        return False
    markers = (
        "wm-materialized-expansion",
        "wm-platinum-expansion",
        "## Frequently asked questions",
        "qualityTier: platinum",
    )
    if any(m in body for m in markers):
        return False
    return True


def repair_top_blogs(site_filter: str | None) -> dict:
    repaired: list[str] = []
    skipped: list[str] = []
    for site in load_geo_sites(site_filter):
        brand = site.get("brand", "wreckmatch")
        en_dir, _ = blog_dirs_for_brand(brand)
        slugs = TRUCK_TOP_SLUGS if brand == "semitruckmatch" else TOP_BLOG_SLUGS
        for slug in slugs:
            path = en_dir / f"{slug}.md"
            if not path.exists():
                skipped.append(slug)
                continue
            if not blog_needs_geo_repair(path):
                skipped.append(slug)
                continue
            log(f"GEO repair materialize: {path}")
            proc = subprocess.run(
                ["npx", "tsx", "scripts/materialize-blog-platinum.ts", f"--slug={slug}"],
                cwd=str(ROOT),
                capture_output=True,
                text=True,
                timeout=180,
            )
            if proc.returncode == 0:
                repaired.append(slug)
                subprocess.run(
                    [sys.executable, str(ROOT / "scripts/queue_indexnow_slug.py"), "--site", site["id"], slug],
                    cwd=str(ROOT),
                    timeout=30,
                    check=False,
                )
            else:
                log(proc.stderr[-500:] if proc.stderr else "materialize failed")
    return {"repaired": repaired, "skipped": skipped}


def ping_prod_crons(origins: list[str]) -> list[dict]:
    secret = os.getenv("CRON_SECRET", "").strip()
    if not secret:
        return [{"skipped": True, "reason": "CRON_SECRET unset"}]
    out = []
    paths = ("/api/geo/cron", "/api/exposure/cron", "/api/indexing/cron")
    for origin in origins:
        for path in paths:
            url = f"{origin.rstrip('/')}{path}"
            req = urllib.request.Request(url, headers={"Authorization": f"Bearer {secret}"})
            try:
                with urllib.request.urlopen(req, timeout=120) as resp:
                    body = resp.read().decode()[:600]
                out.append({"url": url, "ok": True, "status": resp.status, "body": body})
                break
            except Exception as e:
                out.append({"url": url, "ok": False, "error": str(e)})
    return out


def run_index_all(site_filter: str | None, recent: int) -> list[dict]:
    key = os.getenv("INDEXNOW_KEY", "").strip()
    if not key:
        log("INDEXNOW_KEY not set — skip IndexNow")
        return [{"ok": False, "error": "INDEXNOW_KEY missing"}]

    results = []
    for site in load_geo_sites(site_filter):
        pending = load_pending(site)
        urls = collect_urls(site, recent, pending)
        log(f"IndexNow {site['id']}: {len(urls)} URLs")
        batch = submit_indexnow(site["origin"], urls, key)
        if batch.get("ok"):
            clear_pending(site)
        results.append({**batch, "siteId": site["id"]})
    return results


def main() -> int:
    load_local_secrets()
    p = argparse.ArgumentParser(description="GEO Secret Sauce automation")
    p.add_argument("--index-only", action="store_true")
    p.add_argument("--skip-index", action="store_true")
    p.add_argument("--site", default="", help="Single site id from geo-sites.json")
    p.add_argument("--recent", type=int, default=320)
    p.add_argument("--repair-blogs", action="store_true", help="Materialize top 10 posts missing GEO markers")
    p.add_argument("--live-ai", action="store_true")
    p.add_argument("--notify-all-prod", action="store_true")
    args = p.parse_args()

    site_filter = args.site.strip() or None
    report: dict = {
        "at": datetime.now(timezone.utc).isoformat(),
        "mode": "geo-automation",
        "opsChecklist": [
            "Google Business Profile: add 10 keyword Q&As (same-day local AIO)",
            "Wikidata: create brand entity (P856 website, P1448 label)",
            "Competitor audit: screenshot ChatGPT + Perplexity for 10 target keywords before new articles",
            "Perplexity-Bing bridge: publish + IndexNow → expect Bing in 2-6h",
        ],
    }

    if args.repair_blogs:
        report["blogRepair"] = repair_top_blogs(site_filter)

    if not args.skip_index:
        report["indexnow"] = run_index_all(site_filter, args.recent)

    if not args.index_only:
        report["audits"] = [audit_origin(s["origin"]) for s in load_geo_sites(site_filter)]
        if args.live_ai:
            proc = subprocess.run(
                ["node", str(ROOT / "scripts/ai-citation-monitor.mjs"), "--limit", "20"],
                cwd=str(ROOT),
                capture_output=True,
                text=True,
            )
            report["aiCitations"] = {"ok": proc.returncode == 0}

    if args.notify_all_prod:
        origins = [s["origin"] for s in load_geo_sites(site_filter)]
        report["productionCrons"] = ping_prod_crons(origins)

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
    log(f"Report → {REPORT_PATH}")

    ok = True
    for batch in report.get("indexnow") or []:
        if batch.get("ok") is False:
            ok = False
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
