import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { createRateLimitMiddleware } from "./rate-limit";

function createLimitedApp(limit: number) {
  const app = new Hono();

  app.use(
    "*",
    createRateLimitMiddleware({
      name: crypto.randomUUID(),
      limit,
      windowMs: 60_000,
      methods: ["POST"],
    }),
  );
  app.get("/limited", (c) => c.json({ ok: true }));
  app.post("/limited", (c) => c.json({ ok: true }));

  return app;
}

describe("createRateLimitMiddleware", () => {
  test("limits configured methods after the threshold", async () => {
    const app = createLimitedApp(2);

    expect((await app.request("/limited", { method: "POST" })).status).toBe(200);
    expect((await app.request("/limited", { method: "POST" })).status).toBe(200);

    const limited = await app.request("/limited", { method: "POST" });

    expect(limited.status).toBe(429);
    expect(limited.headers.get("Retry-After")).toBe("60");
    await expect(limited.json()).resolves.toEqual({ error: "Too many requests." });
  });

  test("does not count methods outside the configured set", async () => {
    const app = createLimitedApp(1);

    expect((await app.request("/limited", { method: "GET" })).status).toBe(200);
    expect((await app.request("/limited", { method: "POST" })).status).toBe(200);
  });
});
