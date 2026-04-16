FROM node:18-alpine AS base
RUN corepack enable

FROM base AS installer
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/patches ./.yarn/patches
COPY apps/landing/package.json ./apps/landing/
COPY packages/config/package.json ./packages/config/
COPY packages/tsconfig/package.json ./packages/tsconfig/
RUN yarn install --no-immutable

COPY apps/landing ./apps/landing
RUN yarn workspace landing build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/.next/static ./apps/landing/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/public ./apps/landing/public

EXPOSE 3600
ENV PORT=3600
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/landing/server.js"]
