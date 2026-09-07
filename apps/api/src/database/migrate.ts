import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export function migrationFailure(error: unknown) {
  const cause = error instanceof Error && error.cause ? error.cause : error;
  const message = cause instanceof Error ? cause.message : String(cause);
  const code = typeof cause === "object" && cause !== null && "code" in cause ? String(cause.code) : "unknown";
  return `Database migration failed [${code}]: ${message}${code === "42P07" ? "\nExisting tables may predate migration tracking. Inspect schema/history and back up before using db:adopt-legacy. Do not reset volumes." : ""}`;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ...(process.env.DATABASE_SSL === "true" ? { ssl: true } : {}),
  });
  try {
    await migrate(drizzle(pool), { migrationsFolder: new URL("./migrations", import.meta.url).pathname });
    console.log("Database migrations completed.");
  } catch (error) {
    console.error(migrationFailure(error));
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

if (import.meta.main) {
  void main().catch((error: unknown) => {
    console.error(migrationFailure(error));
    process.exitCode = 1;
  });
}
