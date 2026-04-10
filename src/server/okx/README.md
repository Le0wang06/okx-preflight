# OKX server foundation

This folder contains the minimal backend pieces needed before feature work:

- `signature.ts`: OKX HMAC signature helper
- `client.ts`: typed request wrapper with optional auth headers

Keep exchange calls server-side to avoid leaking secrets.
