#!/usr/bin/env bash
# Indexing + backlinks for one production URL (after deploy).
# Usage: index_site.sh <https://www.example.com>
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if [[ -f "$ROOT/.secrets-setup" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "$ROOT/.secrets-setup"
  set +a
fi
export INDEXNOW_KEY="${INDEXNOW_KEY:-065536e9ab94b89a3451fd0f5ea4a193}"

SITE_URL="${1:?site URL required}"
SITE_URL="${SITE_URL%/}"

if [[ ! -x "$ROOT/.venv/bin/python" ]]; then
  python3 -m venv .venv
  .venv/bin/pip install -q -r scripts/autopilot_requirements.txt
fi
PY="$ROOT/.venv/bin/python"

"$PY" scripts/organic_crush.py --mesh-limit 50 --viral-limit 5 || true
"$PY" scripts/geo_automation.py --index-only --recent 320 || true
"$PY" scripts/indexing_accelerator.py --recent 320 || true

if [[ -n "${CRON_SECRET:-}" ]]; then
  for path in /api/geo/cron /api/exposure/cron /api/indexing/cron; do
    code=$(curl -s -o /tmp/geo-cron.json -w "%{http_code}" \
      -H "Authorization: Bearer $CRON_SECRET" "$SITE_URL$path" || echo "000")
    echo "$path -> HTTP $code"
    [ "$code" = "200" ] && break
  done
else
  echo "CRON_SECRET unset — skipped production GEO/IndexNow crons"
fi
