import { beforeAll, describe, expect, test } from "bun:test";
import { Hono } from "hono";

process.env.DATABASE_URL ??= "postgres://baseplate:baseplate@localhost:5050/baseplate";
process.env.BETTER_AUTH_SECRET ??= "test-secret-for-chat-routes";
process.env.BETTER_AUTH_URL ??= "http://localhost:3000";

describe("adminChatRoutes", () => {
  let app: Hono;

  beforeAll(async () => {
    const { adminChatRoutes } = await import("./chat");
    app = new Hono();
    app.route("/", adminChatRoutes);
  });

  test("rejects unauthenticated session fetch", async () => {
    const response = await app.request("/api/admin/chat/session");

    expect(response.status).toBe(401);
  });

  test("rejects unauthenticated messages fetch", async () => {
    const response = await app.request("/api/admin/chat/session/messages");

    expect(response.status).toBe(401);
  });

  test("rejects unauthenticated message post", async () => {
    const response = await app.request("/api/admin/chat/session/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            id: "msg-1",
            role: "user",
            parts: [{ type: "text", text: "Hello" }],
          },
        ],
      }),
    });

    expect(response.status).toBe(401);
  });
});
