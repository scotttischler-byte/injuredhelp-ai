#!/usr/bin/env python3
"""Daily corpus improvements without human input: mesh links, viral packs, exposure, quality sample."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    steps = [
        [sys.executable, str(ROOT / "scripts/internal_link_mesh.py"), "--limit", "120"],
        [sys.executable, str(ROOT / "scripts/viral_content_pack.py"), "--limit", "12"],
        [sys.executable, str(ROOT / "scripts/exposure_crush.py"), "--recent", "320"],
        ["python3", str(ROOT / "scripts/blog_quality_gate.py"), "--min-score", "100"],
        ["python3", str(ROOT / "scripts/blog_quality_gate.py"), "--min-score", "100", "--es"],
    ]
    for cmd in steps:
        print("→", " ".join(cmd))
        r = subprocess.run(cmd, cwd=str(ROOT))
        if r.returncode != 0:
            print(f"WARN exit {r.returncode}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
