#!/bin/sh
set -e

# Ensure public exists
mkdir -p /app/public

# Helper: escape JS string content
escape_js() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

# Helper: trim surrounding double-quotes from values (if present)
trim_quotes() {
  printf '%s' "$1" | sed -e 's/^"//' -e 's/"$//'
}

PORT_ESC=$(escape_js "${PORT:-}")
NODE_ENV_CLEAN=$(trim_quotes "${NODE_ENV:-}")

# Write runtime envs for client consumption (this file is requested by client code at runtime)
cat > /app/public/runtime-env.js <<EOF
// This file is auto-generated on container start
window.__RUNTIME_ENV__ = {
  PORT: "${PORT_ESC}",
  NODE_ENV: "${NODE_ENV_CLEAN}"
};
EOF

# Ensure readable
chmod 644 /app/public/runtime-env.js || true

# Patch nginx to proxy to the configured node port
if [ -n "${PORT}" ]; then
  sed -i "s/127.0.0.1:[0-9]\{1,5\}/127.0.0.1:${PORT}/g" /etc/nginx/nginx.conf || true
fi

# Start the node server in the background
echo "Starting node server on port ${PORT:-3000}"
node /app/server.js &

# Exec the main process (nginx)
exec "$@"
