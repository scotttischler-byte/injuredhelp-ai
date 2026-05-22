#!/usr/bin/env bash
# Run the WreckMatch blog machine locally 24/7 (keep this terminal open or use tmux/screen).
# Requires: OPENAI_API_KEY in .env.local (optional — uses templates without it)

set -euo pipefail
cd "$(dirname "$0")/.."

INTERVAL="${BLOG_MACHINE_INTERVAL_SEC:-1800}"
BATCH="${BLOG_MACHINE_BATCH:-2}"
USE_AI="${BLOG_MACHINE_AI:-1}"

echo "WreckMatch TRAFFIC MACHINE — every ${INTERVAL}s (batch=${BATCH}) truck/severe/car"
pip install -q -r scripts/autopilot_requirements.txt 2>/dev/null || true

python scripts/wreckmatch_blog_autopilot.py --refill 500

while true; do
  echo "--- $(date -u +%Y-%m-%dT%H:%M:%SZ) ---"
  if [ "$USE_AI" = "1" ]; then
    python scripts/wreckmatch_blog_autopilot.py --batch "$BATCH" --ai --claude-first --syndicate || true
  else
    python scripts/wreckmatch_blog_autopilot.py --batch "$BATCH" --syndicate || true
  fi
  echo "Sleeping ${INTERVAL}s..."
  sleep "$INTERVAL"
done
