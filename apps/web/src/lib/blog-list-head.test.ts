import { afterEach, describe, expect, test } from "bun:test";
import type { PublicBlogPostsResponse } from "@repo/types/blog";
import { blogListHead } from "./blog-list-head";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const loaderData: PublicBlogPostsResponse = {
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
  pagination: { page: 1, pageSize: 9, total: 1, totalPages: 1 },
};

describe("blogListHead", () => {
  test("emits the spec title and description without fetching", () => {
    const requested: string[] = [];
    globalThis.fetch = ((input: RequestInfo | URL) => {
      requested.push(String(input));
      return Promise.resolve(new Response("{}", { status: 200 }));
    }) as typeof fetch;

    const head = blogListHead({ loaderData });

    expect(requested).toEqual([]);
    expect(head.meta).toEqual([
      { title: "Blog · The Baseplate" },
      {
        name: "description",
        content: "Updates from the admin workspace, product surface, and engineering decisions behind Baseplate.",
      },
    ]);
  });
});
