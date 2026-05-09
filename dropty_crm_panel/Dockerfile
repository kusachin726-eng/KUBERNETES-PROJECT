# -------- Stage 1: Builder --------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies using CI for clean install
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Build Next.js standalone output
ENV NODE_ENV=production
RUN npm run build


# -------- Stage 2: Runner --------
FROM node:22-alpine AS runner

# Install nginx + process supervisor + envsubst
RUN apk add --no-cache nginx tini gettext \
    && mkdir -p /etc/nginx/conf.d /etc/nginx/http.d

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 nodejs && \
    adduser -D -u 1001 -G nodejs nodejs

# Copy standalone server build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy NGINX templates + entrypoint
COPY nginx-map.conf.template /app/nginx-map.conf.template
COPY nginx-server.conf.template /app/nginx-server.conf.template
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENV NODE_ENV=production
ENV APP_PORT=3000

# Expose HTTP
EXPOSE 80

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
    CMD wget -qO- http://127.0.0.1/health || exit 1

# tini ensures clean process shutdown
ENTRYPOINT ["/sbin/tini", "--"]

# Run entrypoint
CMD ["/app/entrypoint.sh"]