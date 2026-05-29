#!/usr/bin/env python3
"""
Hands-off organic growth — runs everything that needs no human input.

1. Internal link mesh (batch of posts)
2. Viral/social copy packs
3. Exposure crush (IndexNow + AI citation checklist)
4. Social ready export for phone copy-paste
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "content/autopilot/organic_crush_report.json"


def run(cmd: list[str], label: str) -> dict:
    try:
        r = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True, timeout=900)
        return {
            "label": label,
            "ok": r.returncode == 0,
            "code": r.returncode,
            "tail": (r.stdout or r.stderr or "")[-1200:],
        }
    except Exception as e:
        return {"label": label, "ok": False, "error": str(e)}


def export_social_ready() -> dict:
    syn_dir = ROOT / "content/syndication"
    out_dir = ROOT / "content/autopilot/social_ready"
    out_dir.mkdir(parents=True, exist_ok=True)
    latest = syn_dir / "latest.json"
    count = 0
    if latest.exists():
        data = json.loads(latest.read_text(encoding="utf-8"))
        slug = data.get("slug", "latest")
        md = [
            f"# Post when you have 60 seconds — {data.get('title', slug)}",
            "",
            "## LinkedIn",
            data.get("linkedin", ""),
            "",
            "## X",
            data.get("twitter", ""),
            "",
            "## Facebook",
            data.get("facebook", ""),
            "",
            f"Link: {data.get('url', '')}",
        ]
        (out_dir / f"{slug}_ready.md").write_text("\n".join(md), encoding="utf-8")
        count = 1
    return {"exported": count, "dir": str(out_dir)}


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--mesh-limit", type=int, default=60)
    p.add_argument("--viral-limit", type=int, default=6)
    p.add_argument("--slugs", nargs="*", default=[])
    p.add_argument("--skip-exposure", action="store_true")
    args = p.parse_args()

    report: dict = {"at": datetime.now(timezone.utc).isoformat(), "steps": []}

    mesh_cmd = [sys.executable, str(ROOT / "scripts/internal_link_mesh.py"), "--limit", str(args.mesh_limit)]
    if args.slugs:
        mesh_cmd.extend(["--slug", *args.slugs])
    report["steps"].append(run(mesh_cmd, "internal_link_mesh"))

    viral_cmd = [sys.executable, str(ROOT / "scripts/viral_content_pack.py"), "--limit", str(args.viral_limit)]
    if args.slugs:
        viral_cmd.extend(["--slug", args.slugs[0]])
    report["steps"].append(run(viral_cmd, "viral_content_pack"))
    report["social_ready"] = export_social_ready()

    if not args.skip_exposure:
        exp = [sys.executable, str(ROOT / "scripts/exposure_crush.py"), "--recent", "320"]
        if args.slugs:
            exp.extend(["--slugs", *args.slugs])
        report["steps"].append(run(exp, "exposure_crush"))

    report["ok"] = all(s.get("ok", False) for s in report["steps"])
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
