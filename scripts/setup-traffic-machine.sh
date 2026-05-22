#!/usr/bin/env bash
# One-shot setup: Vercel CRON_SECRET + optional GitHub Actions secrets.
# Run from repo root: ./scripts/setup-traffic-machine.sh

set -euo pipefail
cd "$(dirname "$0")/.."

SECRETS_FILE=".secrets-setup"
REPO="scotttischler-byte/injuredhelp-ai"
GITHUB_SECRETS_URL="https://github.com/${REPO}/settings/secrets/actions"
GITHUB_ACTIONS_URL="https://github.com/${REPO}/actions/workflows/wreckmatch-traffic-machine.yml"

echo "=== WreckMatch Traffic Machine setup ==="
echo ""

# --- CRON_SECRET (shared: Vercel crons + GitHub workflow curl) ---
if [[ -f "$SECRETS_FILE" ]] && grep -q '^CRON_SECRET=' "$SECRETS_FILE" 2>/dev/null; then
  # shellcheck disable=SC1090
  source "$SECRETS_FILE"
  echo "Using existing CRON_SECRET from $SECRETS_FILE"
else
  CRON_SECRET="$(openssl rand -hex 32)"
  echo "CRON_SECRET=${CRON_SECRET}" >> "$SECRETS_FILE"
  chmod 600 "$SECRETS_FILE"
  echo "Generated CRON_SECRET → saved to $SECRETS_FILE (gitignored)"
fi

if command -v vercel >/dev/null 2>&1; then
  echo ""
  echo "Adding CRON_SECRET to Vercel (production + preview)..."
  for env in production preview; do
    if vercel env ls 2>/dev/null | grep -q "CRON_SECRET"; then
      echo "  CRON_SECRET already exists on Vercel — skip $env (rm/re-add in dashboard if rotating)"
    else
      printf '%s' "$CRON_SECRET" | vercel env add CRON_SECRET "$env" --force 2>/dev/null \
        || printf '%s' "$CRON_SECRET" | vercel env add CRON_SECRET "$env"
      echo "  ✓ $env"
    fi
  done
  echo "Redeploy production so crons pick up the secret:"
  echo "  vercel --prod"
else
  echo "Vercel CLI not found — add CRON_SECRET manually in Vercel → Project → Settings → Environment Variables"
fi

# --- GitHub secrets ---
echo ""
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  echo "Setting GitHub Actions secrets..."
  gh secret set CRON_SECRET --body "$CRON_SECRET" --repo "$REPO"
  if [[ -n "${ANTHROPIC_API_KEY:-}" ]]; then
    gh secret set ANTHROPIC_API_KEY --body "$ANTHROPIC_API_KEY" --repo "$REPO"
  fi
  if [[ -n "${OPENAI_API_KEY:-}" ]]; then
    gh secret set OPENAI_API_KEY --body "$OPENAI_API_KEY" --repo "$REPO"
  fi
  echo "✓ GitHub secrets updated"
else
  echo "GitHub CLI not logged in. Paste this secret in GitHub (one time):"
  echo "  $GITHUB_SECRETS_URL"
  echo ""
  echo "  Name: CRON_SECRET"
  echo "  Value: (open $SECRETS_FILE and copy CRON_SECRET= line)"
  echo ""
  echo "Optional for AI-written posts (otherwise templates run free):"
  echo "  ANTHROPIC_API_KEY — https://console.anthropic.com/"
  echo "  OPENAI_API_KEY    — https://platform.openai.com/api-keys"
fi

echo ""
echo "Enable Actions (if off): https://github.com/${REPO}/settings/actions"
echo "Run machine now: $GITHUB_ACTIONS_URL → Run workflow"
echo ""
echo "Without ANTHROPIC_API_KEY: ~96 template posts/day still deploy to wreckmatch.com."
echo "800 leads/day needs ads + GHL + conversion — this machine feeds SEO/traffic."
echo "Done."
