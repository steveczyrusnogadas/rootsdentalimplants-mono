# Baseplate Feature Ideas

## Goal

This document lists practical features that would make `baseplate-mono` a stronger starter for new projects while preserving its current purpose: a small, deterministic TypeScript-first monorepo with Vite React apps, a Bun + Hono API, Better Auth, Drizzle, PostgreSQL, shared UI, and Turborepo orchestration.

## Current Foundation

- **Monorepo:** Bun workspaces with Turborepo.
- **Frontend apps:** Public `apps/web` and authenticated `apps/admin` using Vite, React, TanStack Router, Tailwind CSS v4, and shadcn/ui.
- **Backend app:** `apps/api` using Bun, Hono, Drizzle ORM, PostgreSQL, and Better Auth (including password reset email via Resend and BullMQ workers).
- **Shared contracts:** `packages/types` holds Zod schemas and TS types for admin users, blog, media, activity, readiness, seed payloads, and public blog APIs; API routes use `.safeParse` on shared payloads.
- **Admin workflows:** Lead management, profile/settings with avatar uploads to S3-compatible storage, searchable/paginated users table, Activity audit trail, notification bell, settings readiness card, blog/media workflows.
- **Infra patterns:** Redis + BullMQ worker process, domain jobs (email, notifications, etc.), contact/auth rate limiting with configurable buckets and trusted-proxy handling, `GET /health` and `GET /ready`, Dockerfile and Dokploy-oriented compose guidance (`DOKPLOY.md`, `docker-compose.prod.yml`).
- **Database scripts:** `db:generate`, `db:migrate`, `db:studio`, `seed:admin`, `seed:demo`, `db:reset-demo`.
- **Frontend integration:** `apps/admin` uses a typed `adminApi` helper (`src/lib/api.ts`) with shared `ErrorResponse` typing from `@repo/types`.
- **Quality gates:** GitHub Actions CI runs install, typecheck, lint, and build.
- **Shared packages:** `@repo/ui` (including shared theme provider and light/dark/system toggles), shared ESLint and TypeScript configs, and `@repo/types`.

## Highest-Value Features

### 1. First-Class Testing Setup

Add a minimal test stack with examples for API routes, shared utilities, and frontend components.

- **Why:** Starters are safer when projects inherit a working test pattern; CI can later run tests automatically.
- **Good outcome:** `bun run test` or a Turborepo-backed test command works across packages.
- **Candidate scope:** API route tests, auth helper tests, UI smoke tests, test database strategy.

### 2. Production Auth Hardening (remaining gaps)

Better Auth already covers sessions, admin plugin, password reset email, and rate limits on sensitive POST routes. Stretch toward typical production expectations.

- **Good outcome:** Safer defaults and clearer operator controls for projects cloned from the baseplate.
- **Candidate scope:** Email verification flows, optional 2FA (settings currently surface placeholders), secure cookie / origin documentation for prod, optional audit enhancements beyond the existing activity feed.

### 3. Environment and Configuration System

Centralize environment parsing, documentation, and app-specific config beyond scattered `process.env` reads.

- **Why:** The API already depends on many env vars; a single validation boundary reduces drift between `.env.example` and runtime.
- **Good outcome:** Missing or invalid config fails early with actionable messages.
- **Candidate scope:** `apps/api/src/config` (or similar), frontend public env conventions, completeness checks for `.env.example`.

### 4. Observability and Error Handling (remaining gaps)

Health and readiness endpoints exist; responses are not yet uniformly structured across all routes.

- **Why:** Baseplates should include a clear production debugging path.
- **Good outcome:** Request correlation, consistent API error envelopes where helpful, and logs that aid debugging without leaking secrets.
- **Candidate scope:** Structured logger, request IDs, Hono error middleware polish, standardized error body where it adds value beyond today’s `{ error: string }` pattern.

### 5. Admin Dashboard Essentials (remaining gaps)

Core admin surfaces exist (users, leads, blog, media, activity, settings). Round out patterns some teams still build manually.

- **Good outcome:** Fewer placeholder cards and more actionable admin UX.
- **Candidate scope:** In-admin password change (vs. only Better Auth reset email), replacing placeholder security/invite metrics on settings with real data or removing them, reusable empty/loading/error patterns where still inconsistent.

## Nice-to-Have Features

### 6. OpenAPI or Contract Documentation

Generate API documentation from route handlers or validation schemas.

- **Candidate scope:** OpenAPI JSON endpoint, docs route, generated client types.

### 7. Forms Abstraction Polish

TanStack Form is already used in admin; standardize further where validation and submission UX diverges.

- **Candidate scope:** Shared field-error presentation, schema-backed validation helpers aligned with `@repo/types`, consistent loading/error behavior across forms.

### 8. Authorization Model Beyond Admin/User

Prepare for project-specific permissions without overcomplicating the baseplate.

- **Candidate scope:** Permission constants, role-to-permission mapping, route guard helpers, UI capability checks.

### 9. Multi-Tenancy Option

Offer an optional organization/workspace model for SaaS projects.

- **Candidate scope:** Better Auth organization plugin, organization switcher, scoped admin routes, membership roles.

### 10. Developer Onboarding Checklist

Root `README.md` covers local setup; optional checklist-style doc for fork rename and branding.

- **Candidate scope:** Rename apps, set env vars, migrate database, seed admin, update branding, run quality gates—consolidated as a short checklist if README grows further.

### 11. Example Feature Module

Include one realistic vertical slice showing preferred conventions.

- **Candidate scope:** `projects`, `tasks`, or `notes` module with database table, API CRUD, shared types, admin UI, and tests.

### 12. Starter Branding Configuration

Make project identity easier to change in one place after cloning.

- **Candidate scope:** App name, tagline, nav labels, metadata, favicon placeholders, small shared config consumed by web/admin.

## Suggested Implementation Order

1. **Testing:** Add minimal tests and wire CI to run them when present.
2. **Config and observability:** Centralize env parsing; add structured logging and consistent error handling where it pays off.
3. **Auth gaps:** Email verification and 2FA once testing/config foundations exist.
4. **Admin UX polish:** Password change and real settings vs. placeholders.

## Recommended First Milestone

Add an automated test baseline:

- Pick Bun’s test runner (or Vitest) with one API route test hitting a public or health endpoint and one small `@repo/types` parse test.
- Register a root `test` script and extend CI with `bun run test` after install.

That establishes a pattern for future changes without blocking on larger auth or multi-tenancy work.
