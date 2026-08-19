import { afterEach, describe, expect, test } from "bun:test";
import { getRedisUrl } from "./redis";

const originalEnv = {
  NODE_ENV: process.env.NODE_ENV,
  REDIS_URL: process.env.REDIS_URL,
};

afterEach(() => {
  if (originalEnv.NODE_ENV === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalEnv.NODE_ENV;
  }

  if (originalEnv.REDIS_URL === undefined) {
    delete process.env.REDIS_URL;
  } else {
    process.env.REDIS_URL = originalEnv.REDIS_URL;
  }
});

describe("getRedisUrl", () => {
  test("uses REDIS_URL when configured", () => {
    process.env.REDIS_URL = "redis://example.com:6379";
    process.env.NODE_ENV = "production";

    expect(getRedisUrl()).toBe("redis://example.com:6379");
  });

  test("falls back to local Redis outside production", () => {
    delete process.env.REDIS_URL;
    process.env.NODE_ENV = "development";

    expect(getRedisUrl()).toBe("redis://localhost:6379");
  });

  test("requires REDIS_URL in production", () => {
    delete process.env.REDIS_URL;
    process.env.NODE_ENV = "production";

    expect(() => getRedisUrl()).toThrow("REDIS_URL is required in production.");
  });
});
