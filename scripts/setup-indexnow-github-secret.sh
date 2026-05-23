#!/usr/bin/env bash
# Run once after: gh auth login
# Sets INDEXNOW_KEY on GitHub for traffic-machine workflow (must match Vercel).
set -euo pipefail
KEY="${1:-}"
if [ -z "$KEY" ]; then
  echo "Usage: ./scripts/setup-indexnow-github-secret.sh YOUR_INDEXNOW_KEY"
  exit 1
fi
gh secret set INDEXNOW_KEY --repo scotttischler-byte/injuredhelp-ai --body "$KEY"
echo "GitHub secret INDEXNOW_KEY set for scotttischler-byte/injuredhelp-ai"
