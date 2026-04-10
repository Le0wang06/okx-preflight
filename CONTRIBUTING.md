# Contributing

## Local setup

1. Use Node.js `22.18.0` (see `.nvmrc` / `.tool-versions`)
2. Run `./scripts/dev/bootstrap.sh`
3. Start the app with `corepack pnpm dev`

## Branch workflow

1. Create a feature branch from `main`
2. Keep commits focused and small
3. Run `corepack pnpm check` before pushing
4. Open a pull request with summary + test notes

## Environment rules

- Never commit `.env.local`
- Use `.env.example` as the source of truth
- Use `corepack pnpm env:check` for dev setup
- Use `corepack pnpm env:check:auth` before testing authenticated OKX flows
