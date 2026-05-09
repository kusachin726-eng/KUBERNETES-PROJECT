#!/bin/sh
# POSIX-compatible entrypoint (avoid bash-only features)
set -eu
# make pipefail optional (some shells don't support it)
set -o pipefail 2>/dev/null || true

# Validate required env vars (can be skipped by setting DISABLE_ENV_CHECK=1)
REQUIRED_VARS="NODE_ENV APP_PORT PGHOST PGPORT PGUSER PGPASSWORD PGDATABASE JWT_SECRET"
MISSING=0
for v in $REQUIRED_VARS; do
  val=$(printenv "$v" || true)
  if [ -z "$val" ]; then
    echo "ERROR: required env var $v is not set"
    MISSING=1
  fi
done
if [ "$MISSING" -eq 1 ] && [ "${DISABLE_ENV_CHECK:-0}" != "1" ]; then
  echo "One or more required env vars are missing. Set them and retry. To skip this check set DISABLE_ENV_CHECK=1"
  exit 1
fi

# Optionally generate .env from template if requested (set ENV_WRITE=1 to write to disk)
if [ "${ENV_WRITE:-0}" = "1" ] && [ -f /app/.env.template ]; then
  echo "Generating /app/.env from template (ENV_WRITE=1)"
  envsubst < /app/.env.template > /app/.env
  chmod 600 /app/.env || true
else
  echo "Skipping .env generation (ENV_WRITE not set). Using environment variables only."
fi

# Set defaults for NGINX runtime env vars (so envsubst receives values even if none provided)
: "${RATE_LIMIT_RATE:=5r/s}"
: "${RATE_LIMIT_BURST:=10}"
: "${RATE_LIMIT_CONN:=20}"
: "${CLIENT_MAX_BODY_SIZE:=10M}"
: "${UPSTREAM_HOST:=127.0.0.1}"
: "${UPSTREAM_PORT:=3005}"

# Export the vars so external programs (envsubst, nginx) see them
export RATE_LIMIT_RATE RATE_LIMIT_BURST RATE_LIMIT_CONN CLIENT_MAX_BODY_SIZE UPSTREAM_HOST UPSTREAM_PORT RATE_LIMIT_ENABLED

echo "NGINX runtime vars: RATE_LIMIT_ENABLED=${RATE_LIMIT_ENABLED:-1} RATE_LIMIT_RATE=$RATE_LIMIT_RATE RATE_LIMIT_BURST=$RATE_LIMIT_BURST RATE_LIMIT_CONN=$RATE_LIMIT_CONN CLIENT_MAX_BODY_SIZE=$CLIENT_MAX_BODY_SIZE UPSTREAM_HOST=$UPSTREAM_HOST UPSTREAM_PORT=$UPSTREAM_PORT"

# Optionally disable rate limiting in the generated config by removing limit directives if RATE_LIMIT_ENABLED=0
TEMPLATE_PATH="/etc/nginx/nginx.conf.template"
if [ "${RATE_LIMIT_ENABLED:-1}" = "0" ]; then
  echo "RATE_LIMIT_ENABLED=0 -> removing limit directives from NGINX config template"
  cp /etc/nginx/nginx.conf.template /etc/nginx/nginx.conf.template.rendered
  sed -i -E '/limit_req_zone|limit_conn_zone|limit_req |limit_conn /d' /etc/nginx/nginx.conf.template.rendered
  TEMPLATE_PATH="/etc/nginx/nginx.conf.template.rendered"
fi

# Ensure log directory exists and log the rate-limit status for observability
LOGFILE="/var/log/nginx/rate_limit_status.log"
mkdir -p /var/log/nginx
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Append a single line describing the effective rate limiting configuration
echo "$timestamp RATE_LIMIT_ENABLED=${RATE_LIMIT_ENABLED:-1} RATE_LIMIT_RATE=$RATE_LIMIT_RATE RATE_LIMIT_BURST=$RATE_LIMIT_BURST RATE_LIMIT_CONN=$RATE_LIMIT_CONN" >> "$LOGFILE"
# Make sure nginx user can read/rotate the log
chown nginx:nginx "$LOGFILE" || true

# Substitute variables into nginx config template
if [ -f "$TEMPLATE_PATH" ]; then
  echo "Generating /etc/nginx/nginx.conf from template ($TEMPLATE_PATH)"
  # Only substitute known runtime variables to avoid replacing nginx $variables (like $host)
  envsubst '${RATE_LIMIT_RATE} ${RATE_LIMIT_BURST} ${RATE_LIMIT_CONN} ${CLIENT_MAX_BODY_SIZE} ${UPSTREAM_HOST} ${UPSTREAM_PORT}' < "$TEMPLATE_PATH" > /etc/nginx/nginx.conf
fi

# Ensure log directories exist
mkdir -p /var/log/nginx
chown -R nginx:nginx /var/log/nginx || true

# Start Node app as a background process (use su-exec to drop privileges to appuser if available)
# Allow overriding what command to run using NODE_CMD or NODE_ENTRY. By default we prefer 'npm start' which runs 'node src' per package.json.
NODE_CMD=${NODE_CMD:-}
NODE_ENTRY=${NODE_ENTRY:-src/index.js}
USE_NPM_START=${USE_NPM_START:-1}

if [ "$USE_NPM_START" = "1" ]; then
  START_CMD="npm start"
else
  START_CMD="node $NODE_ENTRY"
fi

# -------------------------------------------------------
# START NODE WITH PROPER SIGNAL FORWARDING
# Using exec ensures SIGTERM reaches Node
# -------------------------------------------------------
if command -v su-exec >/dev/null 2>&1; then
  echo "Starting node as appuser: $START_CMD"
  su-exec appuser sh -c "exec $START_CMD" &
else
  echo "Starting node (no su-exec): $START_CMD"
  sh -c "exec $START_CMD" &
fi


# Start nginx in foreground
echo "Starting nginx"
exec nginx -g 'daemon off;'
