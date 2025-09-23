#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Please install Node.js 20+ (or 22+) and npm." >&2
  exit 1
fi

cd "$ROOT_DIR"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "Node dependencies installed. Run tests with: npm test"

