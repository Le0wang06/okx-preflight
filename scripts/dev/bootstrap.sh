#!/usr/bin/env bash
set -euo pipefail

if ! command -v corepack >/dev/null 2>&1; then
  echo "corepack is required but not found. Install Node.js 22.18.0 first."
  exit 1
fi

echo "Installing dependencies..."
corepack pnpm install

if [ ! -f ".env.local" ]; then
  echo "Creating .env.local from .env.example..."
  cp .env.example .env.local
fi

echo "Running environment check..."
corepack pnpm env:check
corepack pnpm env:check:example

echo "Running baseline checks..."
corepack pnpm check

echo "Bootstrap complete."
