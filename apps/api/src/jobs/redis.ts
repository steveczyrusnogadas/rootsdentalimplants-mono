export function getRedisUrl() {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("REDIS_URL is required in production.");
  }

  return "redis://localhost:6379";
}

export function getRedisConnection() {
  const redisUrl = getRedisUrl();
  const parsed = new URL(redisUrl);
  const isTls = parsed.protocol === "rediss:";

  return {
    host: parsed.hostname,
    port: Number(parsed.port || "6379"),
    username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    maxRetriesPerRequest: null,
    tls: isTls ? {} : undefined,
  };
}
