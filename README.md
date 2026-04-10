# OKX Preflight

Lean foundation for building an OKX-powered preflight safety app.

## Stack

- Next.js (App Router) + TypeScript
- pnpm package manager
- ESLint + Prettier + lint-staged
- Server-side OKX signing/client scaffold

## Quick start

1. Ensure Node.js `22.18.0` is active.
2. Install dependencies:
   - `corepack pnpm install`
3. Copy env file:
   - `cp .env.example .env.local`
4. Start local dev:
   - `corepack pnpm dev`

## Initial scripts

- `pnpm dev` - run local app
- `pnpm build` - production build
- `pnpm lint` - lint code
- `pnpm typecheck` - TypeScript checks
- `pnpm check` - lint + typecheck + build
- `pnpm format` - format all files

## Current foundation endpoints

- `GET /api/health` - local service heartbeat
- `GET /api/okx/status` - checks whether OKX credentials are configured

## Environment

Set these in `.env.local`:

- `OKX_API_BASE_URL` (default: `https://web3.okx.com`)
- `OKX_API_KEY`
- `OKX_SECRET_KEY`
- `OKX_PASSPHRASE`
- `OKX_PROJECT_ID` (optional)

## What is intentionally not included yet

- No database or Prisma setup
- No wallet connection UI
- No swap routing or preflight scoring logic
