import type { ReadinessCheck, ReadinessResponse } from "@repo/types/admin/readiness";
import { sql } from "drizzle-orm";
import type { Context } from "hono";
import { Hono } from "hono";
import Redis from "ioredis";
import { db } from "../database/client";
import { getRedisUrl } from "../jobs/redis";
import { checkStorageConnection } from "../storage/s3";

export const healthRoutes = new Hono();

healthRoutes.get("/health", (c) => {
  return c.json({
    status: "ok",
    app: "api",
  });
});

async function getDatabaseCheck(): Promise<ReadinessCheck> {
  try {
    await db.execute(sql`select 1`);

    return { status: "ok", message: "Database connection is ready." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed.";

    return { status: "error", message };
  }
}

async function getStorageCheck(): Promise<ReadinessCheck> {
  try {
    await checkStorageConnection();

    return { status: "ok", message: "Object storage bucket is reachable." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Object storage check failed.";

    return { status: "error", message };
  }
}

async function getRedisCheck(): Promise<ReadinessCheck> {
  let client: Redis | null = null;

  try {
    client = new Redis(getRedisUrl(), {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 1_000,
    });

    await client.connect();
    await client.ping();

    return { status: "ok", message: "Redis connection is ready." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Redis connection failed.";

    return { status: "error", message };
  } finally {
    client?.disconnect();
  }
}

function getAuthCheck(): ReadinessCheck {
  const missing = ["BETTER_AUTH_URL", "BETTER_AUTH_SECRET"].filter((name) => !process.env[name]);

  if (missing.length > 0) {
    return { status: "error", message: `Missing auth config: ${missing.join(", ")}.` };
  }

  return { status: "ok", message: "Better Auth configuration is present." };
}

async function getReadinessResponse(): Promise<ReadinessResponse> {
  const [database, redis, storage] = await Promise.all([getDatabaseCheck(), getRedisCheck(), getStorageCheck()]);
  const auth = getAuthCheck();
  const checks = { database, redis, storage, auth };
  const ready = Object.values(checks).every((check) => check.status === "ok");

  return {
    status: ready ? "ready" : "not_ready",
    checks,
    checkedAt: new Date().toISOString(),
  };
}

async function readinessHandler(c: Context) {
  const response = await getReadinessResponse();
  const ready = response.status === "ready";

  return c.json(response, ready ? 200 : 503);
}

healthRoutes.get("/ready", readinessHandler);
healthRoutes.get("/api/ready", readinessHandler);
