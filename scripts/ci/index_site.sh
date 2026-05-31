#!/usr/bin/env bash
# Indexing + backlinks for one production URL (after deploy).
# Usage: index_site.sh <https://www.example.com>
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

SITE_URL="${1:?site URL required}"
SITE_URL="${SITE_URL%/}"

if [[ ! -x "$ROOT/.venv/bin/python" ]]; then
  python3 -m venv .venv
  .venv/bin/pip install -q -r scripts/autopilot_requirements.txt
fi
PY="$ROOT/.venv/bin/python"

"$PY" scripts/organic_crush.py --mesh-limit 50 --viral-limit 5 || true
"$PY" scripts/indexing_accelerator.py --recent 320 || true

if [[ -n "${CRON_SECRET:-}" ]]; then
  curl -sf -H "Authorization: Bearer $CRON_SECRET" "$SITE_URL/api/indexing/cron" || true
else
  echo "CRON_SECRET unset — skipped production IndexNow cron"
fi
