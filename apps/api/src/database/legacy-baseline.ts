import type { PoolClient } from "pg";

export function identifier(value: string) {
  if (!/^[a-z][a-z0-9_]*$/.test(value)) throw new Error("Invalid schema identifier.");
  return `"${value}"`;
}

// Compare PostgreSQL's own interpretation of the baseline, not approximate SQL parsing.
async function catalog(client: PoolClient, schema: string) {
  const columns = await client.query(
    `select t.relname as table_name, a.attname as name,
       format_type(a.atttypid,a.atttypmod) as type, a.attnotnull as not_null,
       pg_get_expr(d.adbin,d.adrelid) as default_value
     from pg_attribute a join pg_class t on t.oid=a.attrelid
     join pg_namespace n on n.oid=t.relnamespace
     left join pg_attrdef d on d.adrelid=t.oid and d.adnum=a.attnum
     where n.nspname=$1 and t.relkind='r' and a.attnum>0 and not a.attisdropped
     order by 1,2`,
    [schema],
  );
  const constraints = await client.query(
    `select t.relname as table_name, c.conname as name,
       pg_get_constraintdef(c.oid) as definition, c.convalidated as validated
     from pg_constraint c join pg_class t on t.oid=c.conrelid
     join pg_namespace n on n.oid=t.relnamespace where n.nspname=$1 order by 1,2`,
    [schema],
  );
  const indexes = await client.query(
    `select t.relname as table_name, i.relname as name,
       pg_get_indexdef(i.oid) as definition, x.indisvalid as valid
     from pg_index x join pg_class t on t.oid=x.indrelid
     join pg_class i on i.oid=x.indexrelid join pg_namespace n on n.oid=t.relnamespace
     where n.nspname=$1 order by 1,2`,
    [schema],
  );
  return Object.entries({ columns: columns.rows, constraints: constraints.rows, indexes: indexes.rows }).flatMap(
    ([kind, rows]) =>
      rows.map((row: Record<string, unknown>) => ({
        key: `${kind}:${row.table_name}:${row.name}`,
        table: String(row.table_name),
        value: JSON.stringify(row).split(`${schema}.`).join(""),
      })),
  );
}

/** Caller owns the transaction. Only the observed pre-chat legacy schema is supported. */
export async function reconcileLegacyBaseline(client: PoolClient, sql: string, target = "public") {
  const probe = `baseline_check_${crypto.randomUUID().split("-").join("")}`;
  await client.query(`CREATE SCHEMA ${identifier(probe)}`);
  await client.query(`SET LOCAL search_path = ${identifier(probe)}`);
  await client.query(sql.split('"public".').join(`${identifier(probe)}.`));
  const expected = await catalog(client, probe);
  await client.query(`SET LOCAL search_path = ${identifier(target)}`);
  const actual = await catalog(client, target);
  const tables = new Set(actual.map((row) => row.table));
  const missingTables = ["chat_message", "chat_session"].filter((table) => !tables.has(table));
  const missingIndex = !actual.some((row) => row.key === "indexes:session:session_user_id_idx");
  const byKey = new Map(actual.map((row) => [row.key, row.value]));
  const differences = expected.filter((row) => byKey.get(row.key) !== row.value);
  const unsupported = differences.filter(
    (row) => !missingTables.includes(row.table) && !(missingIndex && row.key === "indexes:session:session_user_id_idx"),
  );
  if (unsupported.length)
    throw new Error(
      `Legacy schema differs from the baseline: ${unsupported.map((r) => r.key).join(", ")}. No changes committed.`,
    );

  const statements = sql
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean);
  const applied: string[] = [];
  for (const statement of statements) {
    const table = statement.match(/^CREATE TABLE "([^"]+)"/)?.[1];
    const constraintTable = statement.match(/^ALTER TABLE "([^"]+)"/)?.[1];
    if (
      (table && missingTables.includes(table)) ||
      (constraintTable && missingTables.includes(constraintTable)) ||
      (missingIndex && statement.startsWith('CREATE INDEX "session_user_id_idx"'))
    ) {
      await client.query(statement.split('"public".').join(`${identifier(target)}.`));
      applied.push(statement.split("\n")[0]!);
    }
  }
  const verified = new Map((await catalog(client, target)).map((row) => [row.key, row.value]));
  const remaining = expected.filter((row) => verified.get(row.key) !== row.value);
  if (remaining.length)
    throw new Error(`Baseline verification failed: ${remaining.map((r) => r.key).join(", ")}. No changes committed.`);
  await client.query(`DROP SCHEMA ${identifier(probe)} CASCADE`);
  return applied;
}
