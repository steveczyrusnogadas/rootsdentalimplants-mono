# Independent local project

## Establish ownership before setup

Use a separate Git repository for each client. A Git worktree of the starter still shares its repository and is not the final independent client project.

For a new project, choose an absent destination outside the starter and other clients. Inspect source status and the intended revision. A fresh local clone is the current fallback when no verified project generator exists:

```sh
git clone --no-hardlinks -- /absolute/path/to/baseplate /absolute/path/to/new-client
```

Substitute resolved paths; the destination must be new. This copies committed source, not the starter's uncommitted changes, ignored environments, or running data. If required starter work is uncommitted, identify the missing changes and settle the source revision before cloning. In the new clone inspect its remotes, then remove the inherited `origin` pointing at the starter so routine pushes cannot target it. Add a client remote only when supplied/authorized. Retain the license and useful source history; record the source commit in the brief.

If the destination exists, inspect its repository, status, files, and client brief and continue it in place. Never overlay a starter, reset it, or replace its environment to simulate scaffolding. Keep secrets, database/storage contents, dependencies, and build output out of transfers between clients. Inspect tracked environment files before using an unfamiliar starter.

## Use the command interface present in this revision

Read `package.json` and any `scripts/setup.ts` implementation first. When root `setup` exists with the interface documented in `docs/local-development.md`, run from the client root:

```sh
bun run setup
bun run dev
```

That setup interface installs frozen dependencies, generates a private root `.env`, chooses a stable Compose identity and coordinated available ports, starts backing services, migrates, and seeds the first admin. It requires the documented Bun version and Docker Compose v2. `--configure-only` prepares configuration without claiming services are running; `--project=client-name --offset=100` supplies explicit identity and port offset for a new environment. Verify these flags in the current script before use. Prefer automatic isolation unless an explicit identity is needed, and retain it across reruns.

Existing root `.env` is preserved. App-local `.env` files without a root `.env` trigger a preservation stop: follow `docs/local-development.md` for existing data rather than deleting configuration to bypass it. Changing Compose identity creates different volumes; it is not a data migration. Never use `docker compose down -v` as routine setup or repair. Do not reuse another client's environment or volume ownership.

If `setup` is absent, it is not an available command in this checkout. Read `README.md`, environment examples, `docker-compose.yml`, and API configuration for the manual setup path. Existing baseline commands include `bun install --frozen-lockfile`, `docker compose up -d postgres redis minio`, `bun run --filter=api db:migrate`, `bun run --filter=api seed:admin`, and `bun run dev`; verify them against scripts before execution. Create missing ignored environment files from examples without overwriting existing files, supply fresh local credentials, and verify database targets before migrations/seeding. Inspect container names, volumes, published ports, frontend ports/proxies, API/auth/CORS URLs, and storage endpoints for collisions **before** starting services. If the baseline hard-codes shared infrastructure, adapt the independent client configuration within scope or report that isolation is not ready; do not start a conflicting second stack.

Current root quality commands are `bun run check-types`, `bun run lint`, `bun run build`, and `bun run test`; check their definitions and select relevant tests. Where present, `bun run test:setup` covers setup configuration. `bun run dev --filter=web`, `--filter=admin`, and `--filter=api` select app processes; selecting only web does not remove its content/API dependencies.

Keep private credentials in ignored environment files and report only non-secret local URLs. After startup verify API `/health` and `/ready` when the API is part of the chosen stack, then exercise the selected website behavior. Service startup or configure-only success alone does not prove the website works. Record the real commands, URLs, checks, and any remaining startup blocker in the client spec.
