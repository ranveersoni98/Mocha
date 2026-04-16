FROM node:18-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++ openssl
RUN corepack enable

# Copy monorepo root manifests and patches
COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY .yarn/patches ./.yarn/patches

# Copy all workspace package.json files so Yarn resolves the full lockfile
COPY apps/api/package.json ./apps/api/
COPY apps/client/package.json ./apps/client/
COPY apps/docs/package.json ./apps/docs/
COPY apps/landing/package.json ./apps/landing/
COPY packages/config/package.json ./packages/config/
COPY packages/tsconfig/package.json ./packages/tsconfig/

# Copy prisma schema before install so postinstall (prisma generate) succeeds
COPY apps/api/src/prisma ./apps/api/src/prisma

# Install all deps — postinstall runs prisma generate naturally
RUN yarn install --no-immutable && cp yarn.lock /tmp/yarn.lock.resolved

# Copy remaining source — then restore the resolved lockfile so patch entries are preserved
COPY . .
RUN cp /tmp/yarn.lock.resolved ./yarn.lock

# Build API (TypeScript → dist/)
RUN yarn workspace api build

# Build client (Next.js standalone)
RUN yarn workspace client build

# ── runner: minimal production image ────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl
RUN npm install -g pm2

COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js

# API: compiled output + runtime deps
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/node_modules ./node_modules
# Prisma schema + migrations needed at runtime for migrate deploy
COPY --from=builder /app/apps/api/src/prisma ./apps/api/src/prisma

# Client: Next.js standalone — copy to /app root so server.js lands at apps/client/server.js
COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder /app/apps/client/public ./apps/client/public

EXPOSE 3000 5003

CMD ["pm2-runtime", "ecosystem.config.js"]


