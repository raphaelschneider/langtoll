# Production image for the ReLift AI service (relift-web), built for DigitalOcean App Platform.
# Multi-stage → small runtime image from Next.js standalone output (see next.config.ts).
# Build & push with scripts/deploy-prod.sh; App Platform pulls it from DOCR (see infra/prod).
# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# Run as an unprivileged user.
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs
# Standalone server + its assets. `public` and `.next/static` are NOT bundled into standalone,
# so copy them alongside (Next serves static assets relative to the server).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
# App Platform health check hits /api/health (DB connectivity) — see infra/prod/main.tf.
CMD ["node", "server.js"]
