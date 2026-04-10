# OKX Preflight

Foundation setup for building an OKX-powered preflight safety app.

## Stack

- Next.js (App Router) + TypeScript
- pnpm package manager
- ESLint + Prettier + lint-staged
- Prisma with PostgreSQL scaffold

## Quick start

1. Ensure Node.js `22.18.0` is active.
2. Install dependencies:
   - `XDG_CACHE_HOME=$PWD/.cache PNPM_HOME=$PWD/.pnpm-home npx -y pnpm@latest install`
3. Copy env file:
   - `cp .env.example .env.local`
4. Start local dev:
   - `XDG_CACHE_HOME=$PWD/.cache PNPM_HOME=$PWD/.pnpm-home npx -y pnpm@latest dev`

## Initial scripts

- `pnpm dev` - run local app
- `pnpm build` - production build
- `pnpm lint` - lint code
- `pnpm typecheck` - TypeScript checks
- `pnpm format` - format all files

## Next foundation milestones

- Add OKX API client wrappers in `src/server/okx`
- Add preflight risk scoring in `src/features/preflight`
- Add wallet and swap execution UI flow
