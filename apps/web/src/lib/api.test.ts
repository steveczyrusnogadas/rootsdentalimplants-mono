import { afterEach, describe, expect, test } from "bun:test";
import { apiJson, resolveApiUrl } from "./api";

const originalFetch = globalThis.fetch;
const originalViteApiUrl = process.env.VITE_API_URL;
const originalInternalApiUrl = process.env.INTERNAL_API_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;

  if (originalViteApiUrl === undefined) {
    delete process.env.VITE_API_URL;
  } else {
    process.env.VITE_API_URL = originalViteApiUrl;
  }

  if (originalInternalApiUrl === undefined) {
    delete process.env.INTERNAL_API_URL;
  } else {
    process.env.INTERNAL_API_URL = originalInternalApiUrl;
  }
});

function stubJsonFetch() {
  const requested: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    requested.push(String(input));
    return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
  }) as typeof fetch;

  return requested;
}

describe("resolveApiUrl", () => {
  test("throws when VITE_API_URL is missing", () => {
    delete process.env.VITE_API_URL;

    expect(() => resolveApiUrl("/api/media/cover-1")).toThrow();
  });

  test("throws when VITE_API_URL is not absolute", () => {
    process.env.VITE_API_URL = "localhost:3000";

    expect(() => resolveApiUrl("/api/media/cover-1")).toThrow();
  });

  test("prefixes a root-relative media path with VITE_API_URL", () => {
    process.env.VITE_API_URL = "http://localhost:3000/";
    process.env.INTERNAL_API_URL = "http://api:3000";

    expect(resolveApiUrl("/api/media/cover-1")).toBe("http://localhost:3000/api/media/cover-1");
  });
});

describe("apiJson", () => {
  test("uses INTERNAL_API_URL chosen when apiJson runs", async () => {
    process.env.VITE_API_URL = "https://api.example.com";
    process.env.INTERNAL_API_URL = "http://api:3000";

    const requested = stubJsonFetch();

    await apiJson("/api/blog");

    expect(requested).toEqual(["http://api:3000/api/blog"]);
  });

  test("falls back to localhost for local SSR JSON when INTERNAL_API_URL is unset", async () => {
    delete process.env.VITE_API_URL;
    delete process.env.INTERNAL_API_URL;

    const requested = stubJsonFetch();

    await apiJson("/api/blog/recent?limit=3");

    expect(requested).toEqual(["http://localhost:3000/api/blog/recent?limit=3"]);
  });
});
