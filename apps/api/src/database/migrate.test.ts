import { expect, test } from "bun:test";
import { migrationFailure } from "./migrate";

test("exposes PostgreSQL cause hidden inside a migration error", () => {
  const cause = Object.assign(new Error('relation "account" already exists'), { code: "42P07" });
  const error = new Error("Failed query", { cause });
  expect(migrationFailure(error)).toContain('[42P07]: relation "account" already exists');
  expect(migrationFailure(error)).toContain("db:adopt-legacy");
});
