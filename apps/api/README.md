# API

`apps/api` is the Bun + Hono backend for `baseplate-mono`. It exposes health/API routes and mounts Better Auth at `/api/auth/*`.

## Install Dependencies

```sh
bun install
```

## Environment

Copy `.env.example` to `.env` and set the required values:

```sh
cp apps/api/.env.example apps/api/.env
```

| Variable                              | Purpose                                                   |
| ------------------------------------- | --------------------------------------------------------- |
| `DATABASE_URL`                        | PostgreSQL connection string for Drizzle and auth         |
| `DATABASE_SSL`                        | Enable SSL for hosted PostgreSQL connections              |
| `BETTER_AUTH_URL`                     | API origin, usually `http://localhost:3000` locally       |
| `BETTER_AUTH_SECRET`                  | Better Auth secret for signing auth state                 |
| `APP_ORIGINS`                         | Comma-separated web/admin origins allowed by CORS         |
| `REDIS_URL`                           | Redis connection string for BullMQ queues and SSE fan-out |
| `RESEND_API_KEY`                      | Resend API key for transactional email workers            |
| `RESEND_FROM_EMAIL`                   | Verified sender used by transactional email workers       |
| `ADMIN_EMAIL`                         | First admin account email for seeding                     |
| `ADMIN_PASSWORD`                      | First admin account password for seeding                  |
| `ADMIN_NAME`                          | Optional first admin account display name                 |
| `S3_ENDPOINT`                         | S3-compatible object storage endpoint                     |
| `S3_PUBLIC_ENDPOINT`                  | Public S3-compatible endpoint used by browser uploads     |
| `S3_REGION`                           | S3-compatible object storage region                       |
| `S3_BUCKET`                           | Bucket used for app-managed uploads                       |
| `S3_ACCESS_KEY_ID`                    | Object storage access key                                 |
| `S3_SECRET_ACCESS_KEY`                | Object storage secret key                                 |
| `S3_FORCE_PATH_STYLE`                 | Use path-style bucket URLs for local MinIO                |
| `TRUSTED_PROXY_HEADERS`               | Trust `x-forwarded-for` / `x-real-ip` for rate limits     |
| `RATE_LIMIT_CONTACT_MAX`              | Optional contact form requests per window                 |
| `RATE_LIMIT_CONTACT_WINDOW_MS`        | Optional contact form rate limit window                   |
| `RATE_LIMIT_AUTH_MAX`                 | Optional auth POST requests per window                    |
| `RATE_LIMIT_AUTH_WINDOW_MS`           | Optional auth rate limit window                           |
| `EVENT_WORKER_CONCURRENCY`            | Optional BullMQ event worker concurrency                  |
| `EMAIL_WORKER_CONCURRENCY`            | Optional BullMQ email worker concurrency                  |
| `EMAIL_WORKER_RATE_LIMIT_MAX`         | Optional email worker rate limit count                    |
| `EMAIL_WORKER_RATE_LIMIT_DURATION_MS` | Optional email worker rate limit window                   |
| `NOTIFICATION_WORKER_CONCURRENCY`     | Optional notification worker concurrency                  |
| `AI_WORKER_CONCURRENCY`               | Optional placeholder AI worker concurrency                |
| `DEMO_PASSWORD`                       | Optional password for seeded demo accounts                |

## Database

The local Docker services expose PostgreSQL on port `5050`, Redis on port `6379`, MinIO's S3-compatible API on port `9000`, and the MinIO console on port `9001`.

```sh
docker compose up -d postgres redis minio
```

Create the `baseplate` bucket in MinIO before testing uploads, or restart the API after `docker compose up` so it auto-creates the bucket when `S3_ENDPOINT` is set.

Run migrations from the API workspace:

```sh
bun run db:migrate
```

Seed the first admin account:

```sh
bun run seed:admin
```

Seed demo content for a realistic local dashboard:

```sh
bun run seed:demo
bun run db:reset-demo
```

The demo accounts are `demo.admin@example.com` and `demo.user@example.com`. They use `DEMO_PASSWORD` when set, otherwise `demo-password-123`.

## Run

```sh
bun run dev
```

Open `http://localhost:3000`.

Run background workers in a separate terminal when testing queued jobs:

```sh
bun run worker
```

## Routes

| Route                                          | Purpose                                      |
| ---------------------------------------------- | -------------------------------------------- |
| `GET /`                                        | Plain-text API status                        |
| `GET /health`                                  | JSON health check                            |
| `GET /ready`                                   | Dependency readiness checks                  |
| `GET /api/ready`                               | Dependency readiness checks under API prefix |
| `/api/auth/*`                                  | Better Auth handler                          |
| `POST /api/contact`                            | Submit the public contact form               |
| `GET /api/blog`                                | List published blog posts                    |
| `GET /api/blog/recent`                         | List recent published blog posts             |
| `GET /api/blog/:slug`                          | Read a published blog post                   |
| `GET /api/blog/covers/:imageId`                | Redirect to a signed blog cover URL          |
| `GET /api/media/:id`                           | Redirect to a signed media asset URL         |
| `GET /api/admin/activity`                      | List admin audit events                      |
| `GET /api/admin/profile`                       | Current admin profile                        |
| `GET /api/admin/notifications`                 | List admin notifications                     |
| `GET /api/admin/notifications/stream`          | Stream admin notifications over SSE          |
| `PATCH /api/admin/notifications/:id/read`      | Mark one admin notification as read          |
| `POST /api/admin/notifications/read-all`       | Mark all admin notifications as read         |
| `PATCH /api/admin/profile`                     | Update current admin profile                 |
| `POST /api/admin/profile/avatar-upload`        | Create avatar upload URL                     |
| `GET /api/admin/users/:id/avatar`              | Redirect to signed avatar URL                |
| `GET /api/admin/users`                         | List admin-managed users                     |
| `POST /api/admin/users`                        | Create admin-managed user                    |
| `PATCH /api/admin/users/:id`                   | Update admin-managed user                    |
| `DELETE /api/admin/users/:id`                  | Delete admin-managed user                    |
| `GET /api/admin/contacts`                      | List contact submissions                     |
| `POST /api/admin/contacts`                     | Create an internal contact                   |
| `GET /api/admin/contacts/:id`                  | Read a contact submission                    |
| `PATCH /api/admin/contacts/:id`                | Update a contact submission                  |
| `GET /api/admin/leads`                         | List leads                                   |
| `GET /api/admin/leads/stats`                   | Read lead status metrics                     |
| `GET /api/admin/leads/:id`                     | Read a lead                                  |
| `PATCH /api/admin/leads/:id`                   | Update a lead                                |
| `DELETE /api/admin/leads/:id`                  | Delete a lead                                |
| `GET /api/admin/media`                         | List media assets                            |
| `POST /api/admin/media/uploads`                | Create a media upload URL                    |
| `POST /api/admin/media/:id/finalize`           | Finalize a media upload                      |
| `PATCH /api/admin/media/:id`                   | Update media metadata                        |
| `DELETE /api/admin/media/:id`                  | Delete a media asset                         |
| `GET /api/admin/blog`                          | List admin blog posts                        |
| `GET /api/admin/blog/:id`                      | Read an admin blog post                      |
| `POST /api/admin/blog`                         | Create a blog post                           |
| `PATCH /api/admin/blog/:id`                    | Update a blog post                           |
| `DELETE /api/admin/blog/:id`                   | Delete a blog post                           |
| `POST /api/admin/blog/cover-upload`            | Create a blog cover upload URL               |
| `GET /api/admin/settings`                      | Read admin settings                          |
| `PATCH /api/admin/settings/notifications`      | Update notification settings                 |
| `PATCH /api/admin/settings/security/email-otp` | Update email OTP settings                    |
| `DELETE /api/admin/settings/security/totp`     | Disable TOTP for the current admin           |
