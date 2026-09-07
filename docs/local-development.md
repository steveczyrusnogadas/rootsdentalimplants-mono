# Local development and project isolation

Bun runs the API, worker, TanStack Start web server, and admin Vite server on your
host. Docker Compose runs only Postgres, Redis, and MinIO. Bun itself does not
require Docker. Install Bun 1.3.11 and Docker with Compose v2 before full setup.

For a new checkout:

```sh
bun run setup
bun run dev
```

Setup installs dependencies, writes a root `.env` with a random stable Compose
project identity, finds an available group of ports, starts backing services,
waits for Postgres/Redis health, migrates, and seeds the first admin. Credentials
and URLs are in `.env`; it is ignored by git and created with owner-only access.
The API ensures the storage bucket on startup. Check `/ready` after startup to
verify storage and database access; MinIO startup itself is not a readiness test.

Optional: `bun run setup --project=client-name --offset=100` fixes the identity and
adds 100 to all default ports. `--configure-only` only writes configuration, for
example when dependencies/services will be prepared separately. Setup preserves
an existing root `.env` and can be rerun after service startup fails. It rejects
project/offset arguments when that file exists rather than silently moving data.
Generated `BETTER_AUTH_COOKIE_PREFIX` isolates auth cookies across localhost ports.
Each checkout/client should retain its own `.env`. Do not copy one client's
identity into another concurrently running checkout.

Default ports are API 3000, web 5173, admin 5000, Postgres 5050, Redis 6379,
MinIO API 9000, and MinIO console 9001. If any is busy during first setup, setup
tries offsets of 100. This is an availability check, not a port reservation:
startup fails clearly if another process claims an app port later. Vite strict
ports prevent a silent port change from breaking auth/CORS. Backing service
ports bind to loopback only. Docker Compose reads the root `.env`; root Bun
commands pass its values to workspace processes through Turbo.

Use `bun run dev --filter=web`, `--filter=admin`, or `--filter=api` for a subset.
Use root `bun run --filter=api db:migrate` and `seed:admin` for manual database
steps. Launch from the repository root so the root `.env` is loaded. External
services can replace local infrastructure by editing the root URLs; the full
setup command intentionally starts the bundled Compose services.

To change ports, update both the `*_PORT` entries and their matching URLs:
`DATABASE_URL`, `REDIS_URL`, `BETTER_AUTH_URL`, `INTERNAL_API_URL`, `VITE_API_URL`,
`APP_ORIGINS`, `S3_ENDPOINT`, and `S3_PUBLIC_ENDPOINT`. Restart apps and Compose.

## Existing local data

Before changing identity, inventory the existing containers and volumes:

```sh
docker inspect baseplate-postgres baseplate-redis baseplate-minio --format '{{.Name}} {{json .Mounts}}'
docker volume ls --filter label=com.docker.compose.project=baseplate
```

The old default volumes are `baseplate_postgres_data`, `baseplate_redis_data`,
and `baseplate_minio_data`; inspect the actual mounts rather than assuming those
names. Back up Postgres and MinIO before changing deployment ownership.
Never run `docker compose down -v` as an upgrade step.

To retain the old volumes in place, keep `COMPOSE_PROJECT_NAME=baseplate` in the
root `.env`, copy the existing API environment values there, and add the seven
port entries and `INTERNAL_API_URL`/`VITE_API_URL` matching your existing ports.
Remove conflicting app-local environment entries only after preserving their
values. Setup intentionally stops if app-local `.env` files exist without a
root `.env`, so it cannot accidentally replace your database or credentials.
Stop the old containers with the old Compose configuration (without `-v`) before
starting the updated one. Only one checkout can own that retained identity.

For a new identity that must reuse data, use a deliberate backup/restore into new
volumes, or a reviewed Compose override mapping volume keys to the exact old
volume names with `external: true` and `name:`. Do not run two Postgres processes
against the same volume. Merely changing project identity creates new empty
volumes; it does not migrate or delete the old data.

## Existing schema without migration history

Older local databases may have been created with `db:push` and contain tables
while `drizzle.__drizzle_migrations` is empty. The initial migration then reports
`42P07: relation "account" already exists`. This is not a reason to reset data.
`db:migrate` now prints the underlying PostgreSQL error and closes its connections.

The narrowly scoped `db:adopt-legacy` command supports the reviewed pre-chat
baseline. It compares PostgreSQL's column types, nullability, defaults,
constraints, and indexes against the initial SQL migration. It can add the two
missing chat tables and session index; incompatible existing objects cause a
rollback. Extra tables/columns are retained. Existing migration history is never
rewritten. This is not a general schema synchronizer.

After inspecting the database and saving a backup, preview from the root:

```sh
bun run --filter=api db:adopt-legacy
```

The preview rolls back everything. After reviewing the exact additions, apply:

```sh
bun run --filter=api db:adopt-legacy --apply
bun run setup
```

Adoption locks existing tables briefly, verifies the completed baseline, and
records its hash/time in the same transaction as the additions. Normal future
runs use `db:migrate`; setup never adopts an untracked schema automatically.
The database regression test is opt-in through `TEST_DATABASE_URL` and uses
fixture schemas inside a transaction that is always rolled back.
