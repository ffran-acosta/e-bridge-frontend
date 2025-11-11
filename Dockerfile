ARG NODE_IMAGE=node:20.17.0-alpine3.20

FROM ${NODE_IMAGE} AS deps
RUN apk upgrade --no-cache && apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM ${NODE_IMAGE} AS builder
RUN apk upgrade --no-cache && apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build && pnpm prune --prod

FROM ${NODE_IMAGE} AS runner
RUN apk upgrade --no-cache && apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
EXPOSE 3000
CMD ["pnpm", "start"]

