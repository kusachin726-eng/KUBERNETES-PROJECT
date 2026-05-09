# -------------------------------------
# 1️⃣ Dependencies
# -------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund


# -------------------------------------
# 2️⃣ Build
# -------------------------------------
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && find .next/static -type f \( -name '*.gz' -o -name '*.br' \) -delete || true


# -------------------------------------
# 3️⃣ Runtime
# -------------------------------------
FROM node:22-alpine AS runner

RUN apk update && apk upgrade --no-cache \
    && apk add --no-cache libc6-compat curl nginx \
    && rm -rf /var/cache/apk/*

# create nginx runtime dirs and log file
RUN mkdir -p /run/nginx /var/cache/nginx /var/log/nginx \
    && touch /var/log/nginx/limit.log \
    && chmod 644 /var/log/nginx/limit.log
RUN chown -R root:root /run/nginx /var/cache/nginx /var/log/nginx

ARG PORT=3000
ARG NODE_ENV="production"
# DB credentials (set these via runtime env or --env-file; avoid baking secrets into images)
ARG DB_NAME
ARG DB_USER
ARG DB_PASS
ARG DB_HOST
ARG DB_PORT
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV HOSTNAME=0.0.0.0
# Server-side DB envs (kept out of client runtime file)
ENV DB_NAME=${DB_NAME}
ENV DB_USER=${DB_USER}
ENV DB_PASS=${DB_PASS}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# fail early if standalone server.js is missing
RUN test -f /app/server.js || (echo "server.js missing; ensure build produced a standalone server" && exit 1)

# copy entrypoint that writes runtime envs into /app/public/runtime-env.js
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

# copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R root:root /app

# run the entrypoint as the container starts; it will write runtime envs, start node, then exec the CMD (nginx)
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD ["sh", "-c", "curl -f http://localhost:$PORT/health || exit 1"]

# Default command: nginx in foreground (entrypoint will start node server)
CMD ["nginx", "-g", "daemon off;"]
