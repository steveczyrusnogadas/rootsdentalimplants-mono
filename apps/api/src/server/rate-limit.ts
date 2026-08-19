import { createMiddleware } from "hono/factory";

type RateLimitOptions = {
  name: string;
  limit: number;
  windowMs: number;
  methods?: string[];
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function shouldTrustProxyHeaders() {
  return process.env.TRUSTED_PROXY_HEADERS === "true" || process.env.TRUSTED_PROXY_HEADERS === "1";
}

function getClientIp(headers: Headers) {
  if (shouldTrustProxyHeaders()) {
    const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    if (forwardedFor) {
      return forwardedFor;
    }

    const realIp = headers.get("x-real-ip")?.trim();

    if (realIp) {
      return realIp;
    }
  }

  return "unknown";
}

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of Array.from(buckets.entries())) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function getRateLimitConfig() {
  return {
    contact: {
      limit: parsePositiveInteger(process.env.RATE_LIMIT_CONTACT_MAX, 5),
      windowMs: parsePositiveInteger(process.env.RATE_LIMIT_CONTACT_WINDOW_MS, 60_000),
    },
    auth: {
      limit: parsePositiveInteger(process.env.RATE_LIMIT_AUTH_MAX, 10),
      windowMs: parsePositiveInteger(process.env.RATE_LIMIT_AUTH_WINDOW_MS, 60_000),
    },
  };
}

export function createRateLimitMiddleware({ name, limit, windowMs, methods }: RateLimitOptions) {
  const limitedMethods = methods ? new Set(methods.map((method) => method.toUpperCase())) : null;

  return createMiddleware(async (c, next) => {
    if (limitedMethods && !limitedMethods.has(c.req.method.toUpperCase())) {
      await next();
      return;
    }

    const now = Date.now();
    const ip = getClientIp(c.req.raw.headers);
    const key = `${name}:${ip}`;
    const existing = buckets.get(key);
    const bucket = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + windowMs };

    pruneExpiredBuckets(now);
    bucket.count += 1;
    buckets.set(key, bucket);

    const remaining = Math.max(0, limit - bucket.count);
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

    c.header("X-RateLimit-Limit", String(limit));
    c.header("X-RateLimit-Remaining", String(remaining));
    c.header("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > limit) {
      c.header("Retry-After", String(retryAfterSeconds));

      return c.json({ error: "Too many requests." }, 429);
    }

    await next();
  });
}
