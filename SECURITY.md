# Security Policy

## Supported Versions

This project is in active development and currently supports the latest `main` branch only.

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities.

Send details to the repository owner through GitHub private reporting channels when available.
If private reporting is not enabled, open a minimal issue asking for a private contact path without disclosing exploit details.

## Secrets and Credentials

- Never commit `.env.local` or raw API keys.
- Run `corepack pnpm env:check` before local testing.
- CI includes automated secret scanning to catch accidental leaks.
