# baseplate-mono

A TypeScript-first starter monorepo providing a small, deterministic foundation for future apps, packages, and shared tooling.

## What's inside?

### Apps

| App          | Framework                      | Port   | Description                                                                                                                                    |
| ------------ | ------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`   | Vite + React + TanStack Router | `5173` | Public frontend with blog, contact intake, and theming                                                                                         |
| `apps/admin` | Vite + React + TanStack Router | `5000` | Authenticated admin dashboard for users, leads, blog, media, activity, notifications, diagnostics, and settings                                |
| `apps/api`   | Bun + Hono                     | `3000` | Backend API, Better Auth endpoint, admin routes, public content APIs, rate limits, background jobs, notifications, and health/readiness checks |

`apps/web` and `apps/admin` proxy `/api` requests to `http://localhost:3000` during development.

### Packages

| Package                      | Import        | Description                                                                |
| ---------------------------- | ------------- | -------------------------------------------------------------------------- |
| `packages/ui`                | `@repo/ui`    | Shared React components, shadcn/ui components, styles, and theme utilities |
| `packages/eslint-config`     | —             | Shared ESLint configuration                                                |
| `packages/typescript-config` | —             | Shared `tsconfig.json` presets                                             |
| `packages/types`             | `@repo/types` | Shared Zod schemas and TypeScript contracts for API/domain DTOs            |

### Tech Stack

- **Package manager:** [Bun](https://bun.sh/) `1.3.11`
- **Workspace orchestration:** [Turborepo](https://turbo.build/)
- **Frontend:** Vite, React, TanStack Router (file-based), TanStack Query, TanStack Form, Tailwind CSS v4, shadcn/ui
- **Backend:** Bun runtime + [Hono](https://hono.dev/), with an API process and a worker process
- **Auth:** [Better Auth](https://www.better-auth.com/) with email/password auth for admin accounts only (public sign-up disabled), password reset email, session cookies, and admin plugin support
- **Database:** PostgreSQL, Drizzle ORM, Drizzle Kit migrations
- **Content:** Tiptap-powered blog editor with draft/publish workflows, public blog pages, and recent post feeds
- **Storage:** S3-compatible object storage for profile avatars and reusable media library images, backed locally by MinIO
- **Jobs and events:** Redis + BullMQ queues for domain event dispatch, password reset email, and admin notifications
- **AI:** Optional Mastra admin assistant (generic LLM chat in the admin app)
- **Email:** Resend-backed transactional email helpers for password reset delivery
- **Admin operations:** Audit trail, realtime notification bell, scoped auth/contact rate limits, resettable demo seed data, and readiness diagnostics
- **Theming:** Shared light/dark/system theme provider and toggle exported from `@repo/ui`
- **Tooling:** TypeScript, ESLint, Prettier, GitHub Actions CI

## Local Setup

### Prerequisites

- [Bun](https://bun.sh/) `1.3.11` or later

### Install Dependencies

```sh
bun install
```

### Configure API Environment

Copy the API example environment file and set the required values:

```sh
cp apps/api/.env.example apps/api/.env
```

Required API environment variables:

| Variable                              | Purpose                                                            |
| ------------------------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`                        | PostgreSQL connection string for Drizzle and auth                  |
| `DATABASE_SSL`                        | Enable SSL for hosted PostgreSQL connections                       |
| `REDIS_URL`                           | Redis connection string for BullMQ jobs and realtime notifications |
| `BETTER_AUTH_URL`                     | API origin, usually `http://localhost:3000` locally                |
| `BETTER_AUTH_SECRET`                  | Better Auth secret for signing auth state                          |
| `APP_ORIGINS`                         | Comma-separated web/admin origins allowed by CORS                  |
| `ADMIN_EMAIL`                         | First admin account email for seeding                              |
| `ADMIN_PASSWORD`                      | First admin account password for seeding                           |
| `ADMIN_NAME`                          | Optional first admin account display name                          |
| `S3_ENDPOINT`                         | S3-compatible object storage endpoint                              |
| `S3_PUBLIC_ENDPOINT`                  | Public S3-compatible endpoint used by browser uploads              |
| `S3_REGION`                           | S3-compatible object storage region                                |
| `S3_BUCKET`                           | Bucket used for app-managed uploads                                |
| `S3_ACCESS_KEY_ID`                    | Object storage access key                                          |
| `S3_SECRET_ACCESS_KEY`                | Object storage secret key                                          |
| `S3_FORCE_PATH_STYLE`                 | Use path-style bucket URLs for local MinIO                         |
| `TRUSTED_PROXY_HEADERS`               | Trust `x-forwarded-for` / `x-real-ip` for rate limits              |
| `RATE_LIMIT_CONTACT_MAX`              | Optional contact form requests per window                          |
| `RATE_LIMIT_CONTACT_WINDOW_MS`        | Optional contact form rate limit window                            |
| `RATE_LIMIT_AUTH_MAX`                 | Optional auth POST requests per window                             |
| `RATE_LIMIT_AUTH_WINDOW_MS`           | Optional auth rate limit window                                    |
| `RESEND_API_KEY`                      | Resend API key for transactional email                             |
| `RESEND_FROM_EMAIL`                   | Sender identity for password reset email                           |
| `EVENT_WORKER_CONCURRENCY`            | Optional BullMQ event worker concurrency                           |
| `EMAIL_WORKER_CONCURRENCY`            | Optional BullMQ email worker concurrency                           |
| `EMAIL_WORKER_RATE_LIMIT_MAX`         | Optional email worker rate limit count                             |
| `EMAIL_WORKER_RATE_LIMIT_DURATION_MS` | Optional email worker rate limit window                            |
| `NOTIFICATION_WORKER_CONCURRENCY`     | Optional notification worker concurrency                           |
| `OPENAI_API_KEY`                      | Optional OpenAI key for the admin assistant                        |
| `DEMO_PASSWORD`                       | Optional password for seeded demo accounts                         |

Start the local PostgreSQL, Redis, and MinIO services:

```sh
docker compose up -d postgres redis minio
```

MinIO exposes its S3-compatible API at `http://localhost:9000` and its console at `http://localhost:9001`.
Use the credentials from `apps/api/.env.example` locally, and create the `baseplate` bucket before testing avatar or media uploads.

If you previously ran older product-specific schemas, wipe local volumes before migrating:

```sh
docker compose down -v
docker compose up -d postgres redis minio
```

Apply database migrations and seed the first admin account:

```sh
bun run --filter=api db:migrate
bun run --filter=api seed:admin
```

Seed resettable demo users, leads, and blog posts when you want a populated local dashboard:

```sh
bun run --filter=api seed:demo
bun run --filter=api db:reset-demo
```

The demo accounts are `demo.admin@example.com` and `demo.user@example.com`. They use `DEMO_PASSWORD` when set, otherwise `demo-password-123`.

### Start Development

Run all apps in parallel:

```sh
bun run dev
```

Or run a specific app using a [Turborepo filter](https://turbo.build/repo/docs/crafting-your-repository/running-tasks#using-filters):

```sh
bun run dev --filter=web
bun run dev --filter=admin
bun run dev --filter=app
bun run dev --filter=api
```

### Available Root Scripts

| Script        | Command                               | Description                          |
| ------------- | ------------------------------------- | ------------------------------------ |
| `build`       | `turbo run build`                     | Build all workspaces                 |
| `dev`         | `turbo run dev`                       | Run all development servers          |
| `lint`        | `turbo run lint`                      | Lint all workspaces with ESLint      |
| `format`      | `prettier --write "**/*.{ts,tsx,md}"` | Format TypeScript and Markdown files |
| `check-types` | `turbo run check-types`               | Run TypeScript type checks           |

## Frontend Data, Forms, and Theme

Both frontend apps use TanStack Query for server state, TanStack Form for interactive forms, and the shared `@repo/ui` theme provider for light/dark mode.

- Query providers are mounted in `apps/web/src/main.tsx` and `apps/admin/src/main.tsx`.
- Theme providers are mounted in `apps/web/src/main.tsx` and `apps/admin/src/main.tsx`.
- App-local Query clients live in `src/lib/query-client.ts`.
- App-local API helpers live in `src/lib/api.ts`; the admin helper includes `credentials: "include"` for Better Auth session cookies.
- Query key factories live in `src/lib/query-keys.ts` and should be used for every query and mutation key.
- Avoid route-level `fetch` + `useEffect` for API data. Add a query key and use `useQuery`/`useMutation` instead.
- Use TanStack Form for route forms, with field validators and `form.Subscribe` for submit state.
- Use `ThemeToggle` from `@repo/ui/components/theme-toggle` inside app shells instead of creating app-local theme switches.

## Blog and Media

The starter includes a small publishing workflow:

- Admin-only blog management lives under `apps/admin/src/routes/dashboard/blog*.tsx`.
- The blog editor uses Tiptap with stored JSON content, media insertion, image alignment, and image resizing controls.
- Reusable media assets live under the admin Media section and are served through stable `/api/media/:id` URLs.
- Public blog routes live under `apps/web/src/routes/blog*.tsx`; recent posts are also surfaced on the homepage.
- Blog and media API contracts live in `packages/types/src/admin/blog.ts`, `packages/types/src/admin/media.ts`, and `packages/types/src/blog.ts`.

## Admin Operations

The admin dashboard includes operational starter patterns:

- Admin mutations for users, leads, profile updates, and avatar upload preparation are recorded in the audit trail and shown under `/dashboard/activity`.
- Public contact submissions emit a `lead.created` domain event, dispatch through BullMQ, and create admin notifications.
- Admin notifications are persisted, streamed over SSE, and shown in the admin notification bell with mark-read actions.
- Password reset requests use Better Auth, enqueue email work, and send Resend-backed transactional email from the worker process.
- `POST /api/contact` and auth-facing `POST /api/auth/*` requests use configurable in-memory rate limits with JSON 429 responses.
- `GET /health` remains a lightweight liveness check, while `GET /ready` verifies database, object storage, and Better Auth configuration.
- `seed:demo` and `db:reset-demo` populate local users, leads, and blog posts for a realistic dashboard after setup.

## Events, Jobs, and Email

The API is split into request handling and background work:

- `bun run --filter=api dev` starts both the Hono API and the worker during development.
- `bun run --filter=api dev:api` and `bun run --filter=api dev:worker` run each side separately.
- `bun run --filter=api worker` starts the production worker entrypoint.
- Redis backs BullMQ queues for event dispatch, password reset email, admin notifications, and future AI work.
- Resend is used for transactional password reset email when `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are configured.

## Quality Gates

CI runs on pushes to `main` and pull requests with Bun `1.3.11`, frozen dependency installs, type checks, lint, and build. Each app now has an ESLint entrypoint, the repo has a shared Prettier config, and Turbo tracks environment variables that affect builds through `globalEnv`.

### Build

```sh
bun run build
```

You can also build a specific app or package with a filter:

```sh
bun run build --filter=web
```

### Dokploy Deployment

Use `docker-compose.prod.yml` for Dokploy deployments. The production setup builds
the API and both frontend apps from the monorepo, serves the frontend apps as
static nginx sites, and runs Postgres and MinIO with persistent volumes.

See [DOKPLOY.md](DOKPLOY.md) for required domains, environment variables,
migrations, seeding, and smoke tests.
