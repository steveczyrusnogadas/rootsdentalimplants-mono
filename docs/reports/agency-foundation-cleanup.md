# Agency foundation cleanup

2026-09-07 · Integration branch: `codex/project-isolation` · Code baseline: `21f384da4cb011d062e0b7d89be8ee6edb1149e6`

Baseplate now has a tested foundation for independently branded client projects and custom dashboards. It is not yet the complete agency system for choosing presets and adding optional features. This cleanup preserves the current TanStack Start SSR site and existing product capabilities while removing practical obstacles to running multiple clients.

## Delivered and verified

- **Project isolation:** removed fixed global container names and production project name/shared-network attachment. Production resources follow the deployment's identity; Dokploy must enable Isolated Deployments. Two rendered Compose projects have distinct networks and volumes. No production host ports are published.
- **Local setup:** `bun run setup` installs frozen dependencies, saves a stable project identity and coordinated ports/origins in an ignored root `.env`, starts backing services, migrates, and seeds an admin. Host Bun/Vite run the apps. Existing configuration is preserved. Regression checks cover occupied IPv4 ports and setup reruns.
- **Startup correctness:** removed hardcoded frontend CLI ports, enabled strict Vite ports and Turbo environment propagation, made the API port configurable, and closed seed-command connections so setup finishes. Generated auth cookie prefixes prevent localhost projects overwriting one another's sessions.
- **Independent design:** web and admin own their styled primitives, global CSS, theme tokens, and shadcn configuration. Shared contracts remain reusable. Branding one app no longer requires editing a shared visual package.
- **SSR and health:** runtime `INTERNAL_API_URL` remains separate from browser build-time `VITE_API_URL`. Web liveness checks a static endpoint rather than an API-dependent homepage. Missing blog loader data no longer crashes metadata generation.
- **Real type checks:** frontend commands now check both application and Vite configuration projects. Repairs cover Bun types, Tiptap dependency compatibility, Better Auth response typing, ineffective Card props, and test types.
- **Repository workflow:** `.agents/skills/baseplate-client-website` guides independent client creation and delivery using commands and capabilities actually present. It does not pretend a preset generator exists.

## Evidence and limits

The combined branch passed frozen dependency installation, actual workspace type checks, lint, all builds, 26 workspace tests, and 5 setup/configuration tests. The TypeScript repair task also confirmed temporary injected errors were rejected by the declared frontend checks.

End-to-end local setup completed migrations and admin seeding. API `/health` and `/ready`, the SSR homepage with a title in HTML, and admin returned HTTP 200 on the configured ports. Built API/web smoke checks passed; admin sign-in produced the project-specific session cookie. Built web liveness returned 200 with its API unavailable. Docker resolved Postgres, Redis, and MinIO inside the local project network. The TypeScript repair task separately verified published-blog SSR with body/SEO and a missing-blog HTTP 404 against fixtures.

No live deployment, image build, proxy routing, external infrastructure mutation, push, or original-checkout modification occurred. Dokploy behavior on the installed version, public domains, uploads, and production readiness still require deployment smoke tests. Existing volumes were never deleted. Before changing an existing deployment identity, inventory actual mounts and preserve ownership or migrate from backups; a new identity selects new volumes, not migrated data. See [deployment instructions](../../DOKPLOY.md).

## Review and use this worktree

The integrated worktree is `/Users/steve/.codex/worktrees/56cc/baseplate-mono`. Its separate commits retain cleanup, presentation ownership, workflow skill, and TypeScript repairs. Inspect with `git log --oneline` and `git status --short` there. Do not reset or overwrite the original checkout to review it.

```sh
cd /Users/steve/.codex/worktrees/56cc/baseplate-mono
bun run setup
bun run dev
```

This checkout already has an ignored `.env` and local backing services under `baseplate-mono-96f0b6f4`. Web uses `http://localhost:5273`, admin `http://localhost:5100`, and API `http://localhost:3100`. Postgres uses 5150, Redis 6479, and MinIO 9100/9101. Bootstrap credentials are in `.env`; they are not in this report. Dev and temporary smoke-test processes were stopped after checks; backing services and their data were retained.

Run `docker compose stop` from this worktree to stop backing services while preserving data, and `docker compose up -d --wait` to restart them. Never use `down -v` as routine cleanup. New independent client repositories should generate their own `.env`, identity, and ports rather than copying these. See [local development](../local-development.md) for migration and lifecycle details.

## Stack recommendation and remaining agency work

The read-only stack review recommends retaining React/Vite admin with Hono, Drizzle, Postgres, and Better Auth for custom dashboards and CMS work. Existing Start SSR supports request-time CMS content and SEO without requiring a site rebuild for each publication. This is an architectural fit assessment, not a performance benchmark.

A new brochure preset should be much smaller: no bundled backend, admin, Redis, or object-storage service unless the brief requires them. Jobs, storage, and chat should become explicitly optional feature recipes; this cleanup has not yet extracted those dependencies into selectable modules.

Compare **Start prerendering versus Astro** in one small, new static-marketing pilot before choosing that preset's framework. Start documents build-time prerendering; Astro defaults to static rendering and supports on-demand routes when needed. Compare delivery effort, generated HTML/JavaScript, publication workflow, and deployment operations using the same brief. Do not rewrite the working CMS merely to run this experiment. Sources: [Start prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering), [Astro rendering](https://docs.astro.build/en/guides/on-demand-rendering/).

Bun is not tied to Docker: it can run directly under a service manager. Buildpack-based deployment can reduce Dockerfile maintenance while still producing container images; it is not inherently container-free. Neither a buildpack migration nor a hosting benchmark was performed. Sources: [Bun with systemd](https://bun.sh/guides/ecosystem/systemd), [Railpack Bun support](https://railpack.com/languages/bun), [Railpack image builds](https://railpack.com/).

Remaining work is to choose and prove the first small business preset, define safe add-feature recipes, verify independent client deployment/backup workflows, and exercise the repository skill on a real client brief. Visual-direction generation, a generalized generator, and a framework rewrite remain outside this cleanup. The [comparative-starter research](../research/MODULAR-SCAFFOLDING-AGENCY-REUSE.md) supports fixed tested presets, recorded source versions, independent client ownership, and narrow additions after real customization. Its generator roadmap remains proposed work, not completed capability.
