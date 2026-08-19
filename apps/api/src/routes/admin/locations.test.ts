import { beforeAll, describe, expect, test } from "bun:test";
import { Hono } from "hono";

process.env.DATABASE_URL ??= "postgres://baseplate:baseplate@localhost:5050/baseplate";
process.env.BETTER_AUTH_SECRET ??= "test-secret-for-location-routes";
process.env.BETTER_AUTH_URL ??= "http://localhost:3000";

describe("adminLocationRoutes", () => {
  let app: Hono;

  beforeAll(async () => {
    const { adminLocationRoutes } = await import("./locations");
    app = new Hono();
    app.route("/", adminLocationRoutes);
  });

  test("rejects unauthenticated location list", async () => {
    const response = await app.request("/api/admin/locations");

    expect(response.status).toBe(401);
  });

  test("rejects unauthenticated location create", async () => {
    const response = await app.request("/api/admin/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "portland" }),
    });

    expect(response.status).toBe(401);
  });

  test("rejects unauthenticated location update", async () => {
    const response = await app.request("/api/admin/locations/loc-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: false }),
    });

    expect(response.status).toBe(401);
  });
});
