# Deploying To Dokploy

This repo deploys cleanly as a single Dokploy Docker Compose app using
`docker-compose.prod.yml`.

## Services

- `web`: public TanStack Start HTTP server (Nitro/Bun) on port `80`. SSR and static files come from the Start process, not nginx. Attach the public domain on port `80`.
- `admin`: admin Vite/React app, built to static assets and served by nginx on port `80`.
- `api`: Bun/Hono API on port `3000`.
- `migrate`: one-shot Drizzle migration job that runs before the API starts.
- `postgres`: private PostgreSQL database with a persistent named volume.
- `redis`: private Redis instance for BullMQ jobs and admin notification fan-out.
- `minio`: private S3-compatible storage with a persistent named volume.

## Dokploy App Setup

1. Create a new project in Dokploy.
2. Add a Docker Compose app from this Git repository.
3. Set the compose file path to `docker-compose.prod.yml`.
4. Add domains in Dokploy:
   - `web` on port `80`, for example `https://example.com`.
   - `admin` on port `80`, for example `https://admin.example.com`.
   - `api` on port `3000`, for example `https://api.example.com`.
   - `minio` on port `9000`, for example `https://s3.example.com`.
   - Optional: `minio` on port `9001`, for example `https://minio.example.com`, for the MinIO console.
5. Keep `postgres` private. Do not attach a public domain to it.
6. Redeploy the Compose app after adding or changing domains so Dokploy regenerates the Traefik labels.

The MinIO API domain is required because the admin UI uploads directly to
presigned S3 URLs returned by the API.

## Required Environment

Set these in the Dokploy app environment:

```env
POSTGRES_DB=baseplate
POSTGRES_USER=baseplate
POSTGRES_PASSWORD=replace-with-strong-password
DATABASE_URL=postgres://baseplate:replace-with-strong-password@postgres:5432/baseplate
DATABASE_SSL=false
REDIS_URL=redis://redis:6379

BETTER_AUTH_URL=https://api.example.com
BETTER_AUTH_SECRET=replace-with-strong-random-secret
APP_ORIGINS=https://example.com,https://admin.example.com
VITE_API_URL=https://api.example.com
TRUSTED_PROXY_HEADERS=1
RATE_LIMIT_CONTACT_MAX=5
RATE_LIMIT_CONTACT_WINDOW_MS=60000
RATE_LIMIT_AUTH_MAX=10
RATE_LIMIT_AUTH_WINDOW_MS=60000
EVENT_WORKER_CONCURRENCY=5
EMAIL_WORKER_CONCURRENCY=3
EMAIL_WORKER_RATE_LIMIT_MAX=5
EMAIL_WORKER_RATE_LIMIT_DURATION_MS=1000
NOTIFICATION_WORKER_CONCURRENCY=10
OPENAI_API_KEY=

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-temporary-bootstrap-password
ADMIN_NAME=Admin
RESEND_API_KEY=replace-with-resend-api-key
RESEND_FROM_EMAIL="Baseplate <noreply@example.com>"

MINIO_ROOT_USER=baseplate
MINIO_ROOT_PASSWORD=replace-with-strong-minio-password
MINIO_SERVER_URL=https://s3.example.com
MINIO_BROWSER_REDIRECT_URL=https://minio.example.com
S3_ENDPOINT=http://minio:9000
S3_PUBLIC_ENDPOINT=https://s3.example.com
S3_REGION=us-east-1
S3_BUCKET=baseplate
S3_ACCESS_KEY_ID=baseplate
S3_SECRET_ACCESS_KEY=replace-with-strong-minio-password
S3_FORCE_PATH_STYLE=true
```

Use URL-safe passwords in `DATABASE_URL`, or URL-encode special characters.
`S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` should match the MinIO root
credentials unless you create a dedicated MinIO service account.
Keep `TRUSTED_PROXY_HEADERS=1` when the API is behind Dokploy/Traefik so
rate limits use the real client IP from forwarded headers. The `RATE_LIMIT_*`
values are optional tuning knobs; the defaults shown above match the app
defaults.

`INTERNAL_API_URL=http://api:3000` is set on the `web` Compose service at runtime so SSR loaders can reach Hono over Docker DNS. Do not add it as a Vite `VITE_*` build arg. Browser blog/contact calls still use `VITE_API_URL`.

## First Deploy

Database migrations run automatically through the `migrate` service before the
API starts. After the Dokploy deployment starts successfully:

1. Open the `api` service terminal in Dokploy.
2. Open the MinIO console and create the bucket from `S3_BUCKET`, for example `baseplate`.
3. Run `bun run --filter=api seed:admin`.
4. Log in to the admin domain with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
5. Rotate or remove the bootstrap admin password from Dokploy once the real admin account is ready.

If migrations fail, check the `migrate` service logs in Dokploy. The API waits
for this service to finish successfully before it starts.

## Smoke Tests

- Visit `https://api.example.com/health` and confirm it returns `status: "ok"`.
- `curl` the public home, `/about`, `/changelog`, `/blog`, `/contact`, `/contact/thank-you`, and a published `/blog/$slug`. The first HTML should already contain that route's title, description, and (for blog) body/list content — not a loading shell.
- Visit `https://example.com/sitemap.xml` and `https://example.com/robots.txt` and confirm they respond as specified.
- Load the public web domain and confirm blog/contact API calls still use `VITE_API_URL` (the public API origin), not `http://api:3000`.
- Log in through the admin domain.
- Upload an avatar or media image to verify the public MinIO API domain and CORS are correct.
- Publish a blog post with an image and verify it renders through the public web app.
