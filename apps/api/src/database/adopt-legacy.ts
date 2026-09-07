import "dotenv/config";
import { createHash } from "node:crypto";
import { Pool } from "pg";
import { reconcileLegacyBaseline } from "./legacy-baseline";

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ...(process.env.DATABASE_SSL === "true" ? { ssl: true } : {}),
  });
  const client = await pool.connect();
  try {
    const journal = await Bun.file(new URL("./migrations/meta/_journal.json", import.meta.url)).json();
    if (journal.entries.length !== 1 || journal.entries[0].tag !== "0000_flaky_vulture") {
      throw new Error(
        "This adoption tool only supports the reviewed initial baseline. Review later migrations separately.",
      );
    }
    const sql = await Bun.file(new URL("./migrations/0000_flaky_vulture.sql", import.meta.url)).text();
    await client.query("BEGIN");
    await client.query("SET LOCAL lock_timeout = '5s'");
    await client.query("SELECT pg_advisory_xact_lock(72419301)");
    await client.query('CREATE SCHEMA IF NOT EXISTS "drizzle"');
    await client.query(
      'CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint)',
    );
    await client.query('LOCK TABLE "drizzle"."__drizzle_migrations" IN EXCLUSIVE MODE');
    const history = await client.query('SELECT id FROM "drizzle"."__drizzle_migrations"');
    if (history.rowCount)
      throw new Error("Migration history is not empty. Use db:migrate; this adoption tool must not rewrite history.");
    const tables = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    for (const { tablename } of tables.rows as { tablename: string }[]) {
      await client.query(`LOCK TABLE public."${tablename.split('"').join('""')}" IN SHARE ROW EXCLUSIVE MODE`);
    }
    const changes = await reconcileLegacyBaseline(client, sql);
    console.log("Verified required baseline columns, constraints and indexes. Extra objects retained.");
    for (const change of changes) console.log(`Add: ${change}`);
    await client.query('INSERT INTO "drizzle"."__drizzle_migrations" (hash,created_at) VALUES ($1,$2)', [
      createHash("sha256").update(sql).digest("hex"),
      journal.entries[0].when,
    ]);
    if (process.argv.includes("--apply")) {
      await client.query("COMMIT");
      console.log("Legacy baseline adopted; existing rows retained. Run db:migrate next.");
    } else {
      await client.query("ROLLBACK");
      console.log("Preview only; rolled back all changes. Back up the database, then rerun with --apply.");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error instanceof Error ? error.message : "Legacy adoption failed.");
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Legacy adoption failed.");
  process.exitCode = 1;
});
