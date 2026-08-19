import { afterEach, describe, expect, test } from "bun:test";
import type { PublicBlogPost, PublicBlogPostSummary } from "@repo/types/blog";
import { ApiError } from "./api";
import { blogListQuery, blogPostQuery, recentBlogPostsQuery } from "./blog-queries";

const originalFetch = globalThis.fetch;
const originalInternalApiUrl = process.env.INTERNAL_API_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;

  if (originalInternalApiUrl === undefined) {
    delete process.env.INTERNAL_API_URL;
  } else {
    process.env.INTERNAL_API_URL = originalInternalApiUrl;
  }
});

const recentPosts: PublicBlogPostSummary[] = [
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
  {
    id: "post-2",
    title: "Notes from the field",
    slug: "notes-from-the-field",
    excerpt: "What we learned running the starter.",
    authorName: "Ada",
    category: "Product",
    tags: ["ops"],
    seoTitle: null,
    seoDescription: null,
    coverImage: null,
    publishedAt: "2026-07-15T00:00:00.000Z",
  },
  {
    id: "post-3",
    title: "Launch checklist",
    slug: "launch-checklist",
    excerpt: "The last mile before a first deploy.",
    authorName: "Ada",
    category: "Engineering",
    tags: ["launch"],
    seoTitle: null,
    seoDescription: null,
    coverImage: "/api/media/cover-3",
    publishedAt: "2026-07-01T00:00:00.000Z",
  },
];

describe("recentBlogPostsQuery", () => {
  test("loads three recent published posts from Hono", async () => {
    delete process.env.INTERNAL_API_URL;
    const requested: string[] = [];

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      requested.push(String(input));
      return new Response(JSON.stringify({ posts: recentPosts }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const data = await recentBlogPostsQuery(3).queryFn();

    expect(requested).toEqual(["http://localhost:3000/api/blog/recent?limit=3"]);
    expect(data.posts.map((post) => post.title)).toEqual([
      "Shipping the public site",
      "Notes from the field",
      "Launch checklist",
    ]);
  });
});

describe("blogListQuery", () => {
  test("loads page-1 published posts from Hono", async () => {
    delete process.env.INTERNAL_API_URL;
    const requested: string[] = [];

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      requested.push(String(input));
      return new Response(
        JSON.stringify({
          posts: recentPosts,
          pagination: { page: 1, pageSize: 9, total: 3, totalPages: 1 },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }) as typeof fetch;

    const data = await blogListQuery(1, 9).queryFn();

    expect(requested).toEqual(["http://localhost:3000/api/blog?page=1&limit=9"]);
    expect(data.posts.map((post) => post.title)).toEqual([
      "Shipping the public site",
      "Notes from the field",
      "Launch checklist",
    ]);
    expect(data.pagination).toEqual({ page: 1, pageSize: 9, total: 3, totalPages: 1 });
  });
});

const publishedPost: PublicBlogPost = {
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
};

describe("blogPostQuery", () => {
  test("loads a published post from Hono", async () => {
    delete process.env.INTERNAL_API_URL;
    const requested: string[] = [];

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      requested.push(String(input));
      return new Response(JSON.stringify({ post: publishedPost }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const data = await blogPostQuery("shipping-the-public-site").queryFn();

    expect(requested).toEqual(["http://localhost:3000/api/blog/shipping-the-public-site"]);
    expect(data.post.title).toBe("Shipping the public site");
    expect(data.post.content).toEqual(publishedPost.content);
  });

  test("surfaces a 404 when Hono has no published post for the slug", async () => {
    delete process.env.INTERNAL_API_URL;

    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ error: "Blog post not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })) as typeof fetch;

    try {
      await blogPostQuery("missing-slug").queryFn();
      throw new Error("expected blogPostQuery to reject");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 404, message: "Blog post not found." });
    }
  });
});
