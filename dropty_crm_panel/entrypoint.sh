#!/bin/sh
set -euo pipefail

echo "----- Runtime Environment -----"
echo "NODE_ENV=${NODE_ENV:-production}"
echo "APP_PORT=${APP_PORT:-3000}"
echo "APP_RATE=${APP_RATE:-}"
echo "APP_BURST=${APP_BURST:-}"
echo "API_RATE=${API_RATE:-}"
echo "API_BURST=${API_BURST:-}"
echo "--------------------------------"

# Create NGINX dirs if missing
mkdir -p /etc/nginx/conf.d /etc/nginx/http.d

APP_PORT="${APP_PORT:-3000}"

clean_env() {
  val="$(printf "%s" "${1:-}" | tr -d '[:space:]')"
  printf "%s" "$val"
}

APP_RATE="$(clean_env "$APP_RATE")"; : "${APP_RATE:=10}"
APP_BURST="$(clean_env "$APP_BURST")"; : "${APP_BURST:=40}"
API_RATE="$(clean_env "$API_RATE")"; : "${API_RATE:=5}"
API_BURST="$(clean_env "$API_BURST")"; : "${API_BURST:=10}"

export APP_PORT APP_RATE APP_BURST API_RATE API_BURST
export PORT="$APP_PORT"
export HOSTNAME="0.0.0.0"

: "${NEXTAUTH_URL:=http://localhost:${APP_PORT}}"
export NEXTAUTH_URL
echo "[Init] Computed NEXTAUTH_URL=${NEXTAUTH_URL}"

# Render templates
envsubst '$APP_PORT $APP_RATE $APP_BURST $API_RATE $API_BURST' \
  < /app/nginx-map.conf.template \
  > /etc/nginx/http.d/00-websocket-map.conf

envsubst '$APP_PORT $APP_RATE $APP_BURST $API_RATE $API_BURST' \
  < /app/nginx-server.conf.template \
  > /etc/nginx/http.d/default.conf

echo "[Init] Validating nginx configuration..."
if ! nginx -t -c /etc/nginx/nginx.conf 2>&1; then
  echo "[Error] Nginx configuration test failed. Exiting."
  exit 1
fi

cleanup() {
  echo "[Shutdown] Stopping services..."
  kill -TERM "$NODE_PID" 2>/dev/null || true
  kill -TERM "$NGINX_PID" 2>/dev/null || true
  wait "$NODE_PID" 2>/dev/null || true
  exit 0
}

trap cleanup SIGTERM SIGINT

echo "[Init] Starting Next.js on port $APP_PORT..."
node server.js &
NODE_PID=$!

echo "[Init] Starting NGINX..."
nginx -g 'daemon off;' &
NGINX_PID=$!

wait -n
echo "[Exit] One process exited, cleaning up..."
cleanup