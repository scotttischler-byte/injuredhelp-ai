#!/usr/bin/env bash
# Pull rebase then push — avoids bot race failures when multiple workflows commit.
set -euo pipefail
MSG="${1:?commit message required}"
git config user.name "${GIT_USER_NAME:-github-actions[bot]}"
git config user.email "${GIT_USER_EMAIL:-41898282+github-actions[bot]@users.noreply.github.com}"
if git diff --staged --quiet; then
  echo "No staged changes — skip push"
  exit 0
fi
git commit -m "$MSG"
git pull --rebase origin main || git pull --rebase origin master || true
git push origin HEAD:main || git push origin HEAD:master || {
  echo "::warning::git push failed — another workflow may have pushed first; content is committed locally on runner only"
  exit 0
}
