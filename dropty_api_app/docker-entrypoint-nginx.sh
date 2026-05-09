#!/bin/sh
set -e

# Ensure defaults
: "${RATE_LIMIT_RATE:=5r/s}"
: "${RATE_LIMIT_BURST:=10}"
: "${RATE_LIMIT_CONN:=20}"
: "${CLIENT_MAX_BODY_SIZE:=10M}"
: "${UPSTREAM_HOST:=127.0.0.1}"
: "${UPSTREAM_PORT:=3005}"

# Optionally disable rate limiting
TEMPLATE_PATH="/etc/nginx/nginx.conf.template"
if [ "${RATE_LIMIT_ENABLED:-1}" = "0" ]; then
  cp /etc/nginx/nginx.conf.template /etc/nginx/nginx.conf.template.rendered
  sed -i -E '/limit_req_zone|limit_conn_zone|limit_req |limit_conn /d' /etc/nginx/nginx.conf.template.rendered
  TEMPLATE_PATH="/etc/nginx/nginx.conf.template.rendered"
fi

# Substitute only known variables
envsubst '${RATE_LIMIT_RATE} ${RATE_LIMIT_BURST} ${RATE_LIMIT_CONN} ${CLIENT_MAX_BODY_SIZE} ${UPSTREAM_HOST} ${UPSTREAM_PORT}' < "$TEMPLATE_PATH" > /etc/nginx/nginx.conf

# Write rate-limit status log
LOGFILE="/var/log/nginx/rate_limit_status.log"
mkdir -p /var/log/nginx
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "$timestamp RATE_LIMIT_ENABLED=${RATE_LIMIT_ENABLED:-1} RATE_LIMIT_RATE=$RATE_LIMIT_RATE RATE_LIMIT_BURST=$RATE_LIMIT_BURST RATE_LIMIT_CONN=$RATE_LIMIT_CONN" >> "$LOGFILE"
chown nginx:nginx "$LOGFILE" || true

# Start nginx in foreground
exec nginx -g 'daemon off;'
