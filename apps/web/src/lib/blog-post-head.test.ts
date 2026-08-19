import { afterEach, describe, expect, test } from "bun:test";
import type { PublicBlogPostResponse } from "@repo/types/blog";
import { blogPostHead } from "./blog-post-head";

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

const loaderData: PublicBlogPostResponse = {
  post: {
    id: "post-1",
    title: "Shipping the public site",
    slug: "shipping-the-public-site",
    excerpt: "How the home page SSRs recent writing.",
    authorName: "Ada",
    category: "Engineering",
    tags: ["ssr"],
    seoTitle: "SEO title for shipping",
    seoDescription: "SEO description for shipping.",
    coverImage: "/api/media/cover-1",
    publishedAt: "2026-08-01T00:00:00.000Z",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "The post body." }],
        },
      ],
    },
  },
};

describe("blogPostHead", () => {
  test("emits SEO and Open Graph tags from loader data without fetching", () => {
    process.env.VITE_API_URL = "https://api.example.com/";
    process.env.INTERNAL_API_URL = "http://api:3000";
    const requested: string[] = [];
    globalThis.fetch = ((input: RequestInfo | URL) => {
      requested.push(String(input));
      return Promise.resolve(new Response("{}", { status: 200 }));
    }) as typeof fetch;

    const head = blogPostHead({ loaderData });

    expect(requested).toEqual([]);
    expect(head.meta).toEqual([
      { title: "SEO title for shipping" },
      { name: "description", content: "SEO description for shipping." },
      { property: "og:title", content: "SEO title for shipping" },
      { property: "og:description", content: "SEO description for shipping." },
      { property: "og:type", content: "article" },
      { property: "og:image", content: "https://api.example.com/api/media/cover-1" },
    ]);
  });

  test("falls back to title and excerpt and omits og:image when the cover is null", () => {
    const requested: string[] = [];
    globalThis.fetch = ((input: RequestInfo | URL) => {
      requested.push(String(input));
      return Promise.resolve(new Response("{}", { status: 200 }));
    }) as typeof fetch;

    const head = blogPostHead({
      loaderData: {
        post: {
          ...loaderData.post,
          seoTitle: null,
          seoDescription: null,
          coverImage: null,
        },
      },
    });

    expect(requested).toEqual([]);
    expect(head.meta).toEqual([
      { title: "Shipping the public site" },
      { name: "description", content: "How the home page SSRs recent writing." },
      { property: "og:title", content: "Shipping the public site" },
      { property: "og:description", content: "How the home page SSRs recent writing." },
      { property: "og:type", content: "article" },
    ]);
  });
});
