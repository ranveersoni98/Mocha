FROM node:18-alpine AS base
RUN corepack enable

FROM base AS installer
WORKDIR /app

# Copy full monorepo manifests so yarn resolves patches/resolutions correctly
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/patches ./.yarn/patches
COPY apps/docs/package.json ./apps/docs/
COPY packages/config/package.json ./packages/config/
COPY packages/tsconfig/package.json ./packages/tsconfig/
RUN yarn install --no-immutable

COPY apps/docs ./apps/docs
RUN yarn workspace docs build

FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=installer --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nextjs:nodejs /app/apps/docs ./apps/docs

USER nextjs

EXPOSE 3700
ENV PORT=3700
WORKDIR /app/apps/docs
CMD ["/app/node_modules/.bin/next", "start", "-p", "3700"]
