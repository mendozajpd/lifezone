#!/usr/bin/env bash
set -euo pipefail

ARGS=("$@")
if [ -n "${FIREBASE_PROJECT_ID:-}" ]; then
  ARGS+=(--project "$FIREBASE_PROJECT_ID")
fi

exec firebase "${ARGS[@]}"
