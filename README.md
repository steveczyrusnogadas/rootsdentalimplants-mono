# Roots Dental Implant Center

Client homepage built with TanStack Start SSR and Bun. `apps/web` runs independently of the inherited admin/API packages.

```sh
bun install --frozen-lockfile
bun run --cwd apps/web dev --port 5373
```

Deployment: use the root Dockerfile, target `web`, container port `80`. See [Roots deployment guide](docs/roots-deployment.md). Current metadata and robots intentionally prevent indexing pending the final domain and launch approval.

The following sections describe the inherited Baseplate workspace.


A TypeScript-first starter monorepo providing a small, deterministic foundation for future apps, packages, and shared tooling.

## What's inside?

### Apps

| App          | Framework                      | Port   | Description                                                                                                                                    |
| ------------ | ------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`   | TanStack Start + React (SSR)   | `5173` | Public frontend with blog, contact intake, and theming                                                                                         |
| `apps/admin` | Vite + React + TanStack Router | `5000` | Authenticated admin dashboard for users, leads, blog, media, activity, notifications, diagnostics, and settings                                |
| `apps/api`   | Bun + Hono                     | `3000` | Backend API, Better Auth endpoint, admin routes, public content APIs, rate limits, background jobs, notifications, and health/readiness checks |

Ports shown are defaults. Setup selects coordinated ports per checkout. Admin proxies `/api` to `INTERNAL_API_URL`; public web SSR uses that runtime URL and browser calls use build-time `VITE_API_URL`.

### Packages

| Package                      | Import        | Description                                                                       |
| ---------------------------- | ------------- | --------------------------------------------------------------------------------- |
| `packages/ui`                | `@repo/ui`    | Legacy presentation package retained for compatibility; current apps own their UI |
| `packages/eslint-config`     | —             | Shared ESLint configuration                                                       |
| `packages/typescript-config` | —             | Shared `tsconfig.json` presets                                                    |
| `packages/types`             | `@repo/types` | Shared Zod schemas and TypeScript contracts for API/domain DTOs                   |

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
- **Theming:** App-owned light/dark/system theme providers, tokens, and toggles
- **Tooling:** TypeScript, ESLint, Prettier, GitHub Actions CI

## Local Setup

Install Bun 1.3.11 and Docker with Compose v2, then run:

```sh
bun run setup
bun run dev
```

Setup creates a stable per-checkout identity and coordinated available ports,
starts backing services, migrates the database, and seeds an admin. Bun/Vite run
the apps on the host. Credentials and selected URLs are saved in the ignored
root `.env`. Existing configuration is preserved.

See [local development](docs/local-development.md) for custom ports, filtered
commands, external services, and preserving existing volumes before upgrading.
Run `bun run build`, `bun run check-types`, `bun run lint`, and `bun run test`
for workspace quality checks; `bun run test:setup` validates local port plumbing.

## Frontend Data, Forms, and Theme

Both frontend apps use TanStack Query for server state, TanStack Form for interactive forms, and app-owned theme providers for light/dark mode.

- Query providers are mounted through the web Start router/root route and `apps/admin/src/main.tsx`.
- Theme providers are mounted through the web Start router/root route and `apps/admin/src/main.tsx`.
- App-local Query clients live in `src/lib/query-client.ts`.
- App-local API helpers live in `src/lib/api.ts`; the admin helper includes `credentials: "include"` for Better Auth session cookies.
- Query key factories live in `src/lib/query-keys.ts` and should be used for every query and mutation key.
- Avoid route-level `fetch` + `useEffect` for API data. Add a query key and use `useQuery`/`useMutation` instead.
- Use TanStack Form for route forms, with field validators and `form.Subscribe` for submit state.
- Use each app’s `@/components/ui/theme-toggle`. Styled primitives, global CSS, theme tokens, and `components.json` belong to their app so client branding can change independently. See [ADR-0005](docs/adr/0005-app-owned-presentation.md).

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
the API and both frontend apps from the monorepo, serves web through TanStack Start SSR and admin through static nginx, and runs Postgres and MinIO with persistent volumes.

See [DOKPLOY.md](DOKPLOY.md) for required domains, environment variables,
migrations, seeding, and smoke tests.
