import { afterEach, describe, expect, test } from "bun:test";
import type { PublicRecentBlogPostsResponse } from "@repo/types/blog";
import { homeHead } from "./home-head";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const loaderData: PublicRecentBlogPostsResponse = {
  posts: [
    {
      id: "post-1",
      title: "Shipping the public site",
      slug: "shipping-the-public-site",
      excerpt: "How the home page SSRs recent writing.",
      authorName: "Ada",
      category: "Engineering",
      tags: ["ssr"],
      seoTitle: null,
      seoDescription: null,
      coverImage: null,
      publishedAt: "2026-08-01T00:00:00.000Z",
    },
  ],
};

describe("homeHead", () => {
  test("emits the spec title and description without fetching", () => {
    const requested: string[] = [];
    globalThis.fetch = ((input: RequestInfo | URL) => {
      requested.push(String(input));
      return Promise.resolve(new Response("{}", { status: 200 }));
    }) as typeof fetch;

    const head = homeHead({ loaderData });

    expect(requested).toEqual([]);
    expect(head.meta).toEqual([
      { title: "The Baseplate" },
      {
        name: "description",
        content:
          "Start new projects from a working backend, dashboard, database, worker, public site, publishing workflow, and theme system.",
      },
    ]);
  });
});
