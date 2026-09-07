import { expect, test } from "bun:test";
import { Pool } from "pg";
import { identifier, reconcileLegacyBaseline } from "./legacy-baseline";

// Explicit opt-in: creates only transaction-scoped fixture schemas, always rolled back.
const integration = process.env.TEST_DATABASE_URL ? test : test.skip;

integration("adopts the pre-chat baseline without changing existing rows or extra tables", async () => {
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  const c = await pool.connect();
  const schema = `legacy_test_${crypto.randomUUID().split("-").join("")}`;
  try {
    await c.query("BEGIN");
    await c.query(`CREATE SCHEMA ${identifier(schema)}`);
    await c.query(`SET LOCAL search_path = ${identifier(schema)}`);
    const sql = await Bun.file(new URL("./migrations/0000_flaky_vulture.sql", import.meta.url)).text();
    const legacy = sql
      .split("--> statement-breakpoint")
      .filter(
        (s) => !/^\s*(CREATE TABLE|ALTER TABLE) "chat_/.test(s) && !s.includes('CREATE INDEX "session_user_id_idx"'),
      )
      .join("\n");
    await c.query(legacy.split('"public".').join(`${identifier(schema)}.`));
    await c.query("CREATE TABLE extra_data (value text)");
    await c.query("INSERT INTO extra_data VALUES ($1)", ["preserve-me"]);
    await c.query(
      `INSERT INTO "user" (id,name,email,email_verified,created_at,updated_at) VALUES ('fixture','Fixture','fixture@example.test',true,now(),now())`,
    );
    await c.query("SAVEPOINT reproduce_initial_migration");
    await expect(c.query(sql.split('"public".').join(`${identifier(schema)}.`))).rejects.toThrow(
      'relation "account" already exists',
    );
    await c.query("ROLLBACK TO SAVEPOINT reproduce_initial_migration");
    const before = (await c.query('SELECT * FROM "user"')).rows;
    const changes = await reconcileLegacyBaseline(c, sql, schema);
    expect(changes).toHaveLength(5);
    expect((await c.query('SELECT * FROM "user"')).rows).toEqual(before);
    expect((await c.query("SELECT value FROM extra_data")).rows).toEqual([{ value: "preserve-me" }]);
    expect(await reconcileLegacyBaseline(c, sql, schema)).toEqual([]);
    await c.query('ALTER TABLE "user" ALTER COLUMN name DROP NOT NULL');
    await expect(reconcileLegacyBaseline(c, sql, schema)).rejects.toThrow("columns:user:name");
  } finally {
    await c.query("ROLLBACK");
    c.release();
    await pool.end();
  }
});
