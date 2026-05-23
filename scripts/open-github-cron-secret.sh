#!/usr/bin/env bash
# Copies CRON_SECRET to clipboard and opens GitHub Actions secrets page.
# Run once: ./scripts/open-github-cron-secret.sh
set -euo pipefail
cd "$(dirname "$0")/.."
FILE=".secrets-setup"
if [[ ! -f "$FILE" ]]; then
  echo "Missing $FILE — run: ./scripts/setup-traffic-machine.sh"
  exit 1
fi
# shellcheck disable=SC1090
source "$FILE"
if [[ -z "${CRON_SECRET:-}" ]]; then
  echo "CRON_SECRET empty in $FILE"
  exit 1
fi
echo -n "$CRON_SECRET" | pbcopy
echo "✓ CRON_SECRET copied to clipboard"
echo "Opening GitHub → paste with Cmd+V"
open "https://github.com/scotttischler-byte/injuredhelp-ai/settings/secrets/actions"
