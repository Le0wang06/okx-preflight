# OKX Preflight

Lean foundation for building an OKX-powered preflight safety app.

## Stack

- Next.js (App Router) + TypeScript
- pnpm package manager
- ESLint + Prettier + lint-staged
- Server-side OKX signing/client scaffold
- CI workflow for lint/type/build checks
- Security automation with CodeQL, Dependabot, and secrets scanning

## Quick start

1. Ensure Node.js `22.18.0` is active.
2. Run bootstrap:
   - `./scripts/dev/bootstrap.sh`
3. Start local dev:
   - `corepack pnpm dev`

## Initial scripts

- `pnpm dev` - run local app
- `pnpm dev:host` - run dev server on `0.0.0.0:3000`
- `pnpm build` - production build
- `pnpm lint` - lint code
- `pnpm typecheck` - TypeScript checks
- `pnpm check` - lint + typecheck + build
- `pnpm env:check` - validate local environment
- `pnpm env:check:auth` - validate environment for authenticated OKX calls
- `pnpm env:check:example` - validate `.env.example` consistency
- `pnpm dev:doctor` - quick local health check (env + lint + types)
- `pnpm clean` - remove build and TypeScript cache artifacts
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

For authenticated API testing, run:

- `corepack pnpm env:check:auth`

For parser validation against repository templates, run:

- `corepack pnpm env:check:example`

## Hardening included now

- Server-only env and OKX client modules (`server-only`) to prevent accidental client bundling
- OKX request timeout + retry behavior in `src/server/okx/client.ts`
- Structured application error type in `src/server/errors.ts`
- Credential validation that catches partial env config
- CI workflow at `.github/workflows/ci.yml`

## Reliability notes

- `okxRequest` retries on `429` and `5xx` responses with incremental backoff
- `okxRequest` times out by default after 15 seconds
- Authenticated requests require all three credentials:
  - `OKX_API_KEY`
  - `OKX_SECRET_KEY`
  - `OKX_PASSPHRASE`

## What is intentionally not included yet

- No database or Prisma setup
- No wallet connection UI
- No swap routing or preflight scoring logic

## Developer workflow

- Start from `main` and create a feature branch
- Use `corepack pnpm check` before every push
- Open a PR with summary + test notes (template included)
- See `CONTRIBUTING.md` for details

## Security automation

- `CodeQL` workflow runs static security/quality analysis on PRs and pushes
- `Dependabot` opens dependency and GitHub Actions update PRs weekly
- `Secrets Scan` workflow runs gitleaks on PRs/pushes to catch accidental credential leaks
- See `SECURITY.md` for reporting and handling guidance
