# Multi-stage production image: Next standalone + no Playwright/Jest in runtime.
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY vendor/roalla-auth ./vendor/roalla-auth
COPY vendor/roalla-design-system ./vendor/roalla-design-system
RUN npm ci

FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Stable across replicas of the same image; rotate only when you rebuild.
# Generate once: openssl rand -base64 32
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
# Unique per deploy so clients hard-reload when versions skew.
ARG GIT_SHA=unknown
ENV GIT_SHA=$GIT_SHA
ENV NEXT_DEPLOYMENT_ID=$GIT_SHA
RUN npm run build

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
