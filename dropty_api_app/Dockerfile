# ------------------------------------
# 1️⃣ Dependencies Stage
# ------------------------------------
FROM node:24-alpine AS deps

WORKDIR /app
COPY package*.json ./
# Install production dependencies only
RUN npm ci --omit=dev --no-audit --no-fund --production

# Clean up npm cache (reduces layer size)
RUN rm -rf /root/.npm /tmp/*

# ------------------------------------
# 2️⃣ Runtime Stage (single optimized image with Node + NGINX)
# ------------------------------------
FROM node:24-alpine AS runtime

LABEL org.opencontainers.image.source="https://your.repo/"

# Install minimal runtime packages: nginx, gettext (envsubst), tini, curl, su-exec
RUN apk add --no-cache --update \
    nginx \
    gettext \
    tini \
    curl \
    su-exec && \
    # Clean apk cache and temporary files to reduce image size
    rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

# Create app user/group
RUN addgroup -S appgroup \
    && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production node_modules from deps stage and application files (only what's needed)
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package*.json ./
COPY .env.template ./
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY docker-entrypoint-nginx.sh /usr/local/bin/docker-entrypoint-nginx.sh

# Fix permissions and remove files not needed at runtime
RUN chmod +x /usr/local/bin/docker-entrypoint.sh /usr/local/bin/docker-entrypoint-nginx.sh && \
    chown -R appuser:appgroup /app /var/log/nginx || true && \
    # Remove npm artifacts if any
    rm -rf /root/.npm /tmp/* /var/tmp/*

# Expose ports
EXPOSE 3005 80

# Lightweight healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -f http://127.0.0.1/ready || exit 1

# Use a single entrypoint to run Node (as unprivileged appuser via su-exec) and NGINX via tini
# Keep the image running as root at entry so it can start NGINX (bind to port 80), and drop privileges for node in the entrypoint
# -------------------------------------------------------
# Use tini as PID 1 for proper signal handling
# -------------------------------------------------------
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]

