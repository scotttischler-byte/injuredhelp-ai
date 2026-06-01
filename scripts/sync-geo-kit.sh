#!/usr/bin/env bash
# Install GEO Secret Sauce into another project repo.
# Usage: bash scripts/sync-geo-kit.sh /Users/scott/wreckmatch
#        bash scripts/sync-geo-kit.sh /Users/scott/instantauthority-ai vite
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:?target directory required}"
FLAVOR="${2:-next}" # next | vite

echo "GEO kit: $SRC -> $TARGET ($FLAVOR)"

mkdir -p "$TARGET/docs" "$TARGET/public" "$TARGET/.cursor/rules" "$TARGET/scripts" "$TARGET/config"

cp "$SRC/docs/CURSOR_SECRET_SAUCE.md" "$TARGET/docs/"
cp "$SRC/docs/GEO_AUTOMATION.md" "$TARGET/docs/"
cp "$SRC/public/secret-sauce.html" "$TARGET/public/"

cp "$SRC/scripts/geo_automation.py" "$TARGET/scripts/"
cp "$SRC/scripts/geo-audit-url.mjs" "$TARGET/scripts/"
cp "$SRC/scripts/queue_indexnow_slug.py" "$TARGET/scripts/"
chmod +x "$TARGET/scripts/geo_automation.py" "$TARGET/scripts/geo-audit-url.mjs" "$TARGET/scripts/queue_indexnow_slug.py" 2>/dev/null || true

cp "$SRC/.cursor/rules/cursor-secret-sauce.mdc" "$TARGET/.cursor/rules/"

if [[ -f "$SRC/.secrets-setup" ]] && [[ ! -f "$TARGET/.secrets-setup" ]]; then
  cp "$SRC/.secrets-setup" "$TARGET/.secrets-setup"
  echo "Copied .secrets-setup"
fi

if [[ "$FLAVOR" == "next" ]]; then
  mkdir -p "$TARGET/content/autopilot"
  echo '{"slugs":[],"updatedAt":""}' > "$TARGET/content/autopilot/indexnow_pending.json"
  cp "$SRC/.github/workflows/geo-automation.yml" "$TARGET/.github/workflows/" 2>/dev/null || mkdir -p "$TARGET/.github/workflows" && cp "$SRC/.github/workflows/geo-automation.yml" "$TARGET/.github/workflows/"
fi

if [[ "$FLAVOR" == "vite" ]]; then
  mkdir -p "$TARGET/public"
  if [[ ! -f "$TARGET/public/robots.txt" ]]; then
    cat > "$TARGET/public/robots.txt" <<'EOF'
User-agent: *
Allow: /

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Google-Extended
Allow: /

Sitemap: https://instantauthority.ai/sitemap.xml
EOF
  fi
  if [[ ! -f "$TARGET/public/llms.txt" ]]; then
    cat > "$TARGET/public/llms.txt" <<'EOF'
# InstantAuthority.ai
> AI-powered Instagram growth and authority building.

## Contact
https://instantauthority.ai
EOF
  fi
  if [[ ! -f "$TARGET/public/ai.txt" ]]; then
    cp "$SRC/public/secret-sauce.html" "$TARGET/public/ai-policy.html" 2>/dev/null || true
    echo "# Allow AI crawlers — see /llms.txt" > "$TARGET/public/ai.txt"
  fi
  mkdir -p "$TARGET/config"
  cat > "$TARGET/config/geo-sites.json" <<'EOF'
{
  "sites": [
    {
      "id": "instantauthority",
      "origin": "https://instantauthority.ai",
      "brand": "instantauthority",
      "indexNow": true,
      "pendingPath": "content/autopilot/indexnow_pending.json"
    }
  ]
}
EOF
  mkdir -p "$TARGET/content/autopilot"
  echo '{"slugs":[],"updatedAt":""}' > "$TARGET/content/autopilot/indexnow_pending.json"
fi

echo "Done. Project-specific: config/geo-sites.json, Next components, vercel crons (if Next)."
