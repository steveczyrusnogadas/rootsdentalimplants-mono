import { Hono } from "hono";
import { auth } from "../auth";
import { createRateLimitMiddleware, getRateLimitConfig } from "../server/rate-limit";

export const authRoutes = new Hono();
const rateLimitConfig = getRateLimitConfig();

authRoutes.use(
  "/api/auth/*",
  createRateLimitMiddleware({
    name: "auth",
    limit: rateLimitConfig.auth.limit,
    windowMs: rateLimitConfig.auth.windowMs,
    methods: ["POST"],
  }),
);

authRoutes.on(["GET", "POST"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});
