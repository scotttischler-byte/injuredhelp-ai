#!/usr/bin/env bash
# Publish fifty-state SLA for one site. Used by GitHub Actions and local agents.
# Usage: fifty_states_publish.sh <site_id> [full|pulse|verify]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

SITE_ID="${1:?site_id required}"
MODE="${2:-pulse}"

if [[ ! -x "$ROOT/.venv/bin/python" ]]; then
  python3 -m venv .venv
  .venv/bin/pip install -q -r scripts/autopilot_requirements.txt
fi
PY="$ROOT/.venv/bin/python"

case "$MODE" in
  verify)
    exec "$PY" scripts/autopilot_daily_guard.py --verify-today --site "$SITE_ID"
    ;;
  full)
    ROUNDS=15
    ;;
  pulse)
    ROUNDS=3
    ;;
  *)
    echo "Mode must be full, pulse, or verify" >&2
    exit 2
    ;;
esac

export AUTOPILOT_SOURCE="${AUTOPILOT_SOURCE:-ci-fifty-states}"
export FIFTY_STATES_ONLY=1

LOG_ROOT=$(python3 -c "
import json
from pathlib import Path
for s in json.loads(Path('config/autopilot-sites.json').read_text())['sites']:
    if s['id'] == '$SITE_ID':
        print(s.get('contentRoot', 'content'))
        break
")
mkdir -p "$LOG_ROOT/autopilot"
"$PY" scripts/publish_fifty_states_now.py \
  --site "$SITE_ID" \
  --batch-size 5 \
  --max-rounds "$ROUNDS" \
  2>&1 | tee -a "$LOG_ROOT/autopilot/fifty_states_sprint.log"

"$PY" scripts/autopilot_daily_guard.py --record-only --site "$SITE_ID"

npm run generate:blog-covers -- --missing-only
"$PY" scripts/generate_blog_presentations.py --missing-only
"$PY" scripts/generate_blog_presentations.py --missing-only --locale es
