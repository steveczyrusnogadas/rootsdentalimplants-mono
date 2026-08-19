FROM oven/bun:1.3.11-alpine AS deps

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

FROM deps AS api-build

RUN bun run --filter=api build

FROM api-build AS api

LABEL org.opencontainers.image.title="baseplate-api"
ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "apps/api/dist/index.js"]

FROM api-build AS worker

LABEL org.opencontainers.image.title="baseplate-worker"
ENV NODE_ENV=production

CMD ["bun", "apps/api/dist/worker.js"]

FROM deps AS web-build

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN bun run --filter=web build

FROM oven/bun:1.3.11-alpine AS web

LABEL org.opencontainers.image.title="baseplate-web"
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=80
COPY --from=web-build /app/apps/web/.output ./.output
EXPOSE 80
CMD ["bun", "run", ".output/server/index.mjs"]

FROM deps AS admin-build

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN bun run --filter=admin build

FROM nginx:1.27-alpine AS admin

LABEL org.opencontainers.image.title="baseplate-admin"
COPY docker/nginx/spa.conf /etc/nginx/conf.d/default.conf
COPY --from=admin-build /app/apps/admin/dist /usr/share/nginx/html

EXPOSE 80
