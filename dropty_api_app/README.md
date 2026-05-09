# Dropty API (backend)

## Overview ✅
This repository contains the Node.js (Express) API and an NGINX reverse-proxy configuration packaged into a single Docker image for convenience. The image is configured to accept runtime environment variables (recommended) rather than baking secrets into the image.

---

## Why `nginx.conf.template` exists ❓
- `nginx.conf.template` contains variable placeholders (e.g., `${RATE_LIMIT_RATE}`) so the NGINX configuration can be generated at container startup using `envsubst`. This allows passing runtime configuration (rate-limits, upstream host/port, etc.) via environment variables without rebuilding the image.
- `nginx.conf` is not committed or baked into the image. The template + entrypoint generates the final `nginx.conf` at runtime.

---

## Runtime configuration (recommended) 🔧
- Do NOT store secrets in the image or repository. Use platform-provided app settings (e.g., **Azure App Service Application Settings**) or a secrets manager (Azure Key Vault).
- Supply env vars at runtime (example):
  - docker run -d --name dropty \
    -p 80:80 -p 3005:3005 \
    -e NODE_ENV=production \
    -e APP_PORT=3005 \
    -e PGHOST=... -e PGPORT=5432 -e PGUSER=... -e PGPASSWORD=... -e PGDATABASE=... \
    -e JWT_SECRET=... \
    dropty-api-app:1.0

Entrypoint environment options:
- `ENV_WRITE=1` : generate `/app/.env` from `.env.template` at startup (only if needed). Default: not set (safer).
- `DISABLE_ENV_CHECK=1` : skip required variable checks (not recommended).
- `USE_NPM_START=1` (default) : run `npm start` to start the Node app (uses package.json `start`). Set to `0` to use `NODE_ENTRY`.
- `NODE_ENTRY` : if `USE_NPM_START=0`, the entrypoint will run `node $NODE_ENTRY`. Default: `src/index.js`.

Required env vars (validated by default):
- NODE_ENV, APP_PORT, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE, JWT_SECRET

---

## NGINX rate limiting (optional env-driven) 🛡️
The NGINX template supports rate limit environment variables but they are optional (the entrypoint applies sensible defaults when not provided):
- `RATE_LIMIT_RATE` (default: `5r/s`)
- `RATE_LIMIT_BURST` (default: `10`)
- `RATE_LIMIT_CONN` (default: `20`)
- `RATE_LIMIT_ENABLED` (default: `1`) — set to `0` to disable NGINX rate limiting entirely

If you don't pass these, the entrypoint will set reasonable defaults at startup. You can override them at runtime by setting the env vars when launching the container.

---

## Health & readiness endpoints ✅
- `GET /health` — NGINX liveness endpoint (served directly by NGINX, very lightweight).
- `GET /ready` — NGINX readiness endpoint proxies to the app's readiness check which now verifies DB connectivity.
  - The application performs a quick `sequelize.authenticate()` with a short timeout. If it fails, `/ready` returns `500 NOT READY`.

This setup is compatible with Docker `HEALTHCHECK`, Kubernetes liveness/readiness probes, and Azure App Service probes.

---

## Database readiness check
- Implemented in the app's `/ready` endpoint using Sequelize's `authenticate()` and a short timeout (2s) to fail fast.
- If you want additional checks (Redis, S3, etc.), I can extend `/ready` accordingly.

---

## Development notes
- Use `.env.template` to document variables — **do not** commit real `.env` with secrets.
- For production, consider running Node and NGINX in separate containers and using a proper orchestrator (Kubernetes or Azure App Service) for better scaling and observability.

---

If you'd like, I can also:
- Add DB connectivity checks for additional stores (Redis, Mongo),
- Add a health-check script for deeper endpoint checks, or
- Convert into a multi-container `docker-compose` or Kubernetes manifests.

