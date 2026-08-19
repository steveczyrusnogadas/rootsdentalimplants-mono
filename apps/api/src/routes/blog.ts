import type { PublicBlogPost, PublicBlogPostSummary } from "@repo/types/blog";
import { and, count, desc, eq, isNotNull, lte } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../database/client";
import { blogPost } from "../database/schema";
import { createObjectDownloadUrl, getBlogCoverObjectKey } from "../storage/s3";
import { getPaginationMeta, getPaginationOffset, parsePaginationParams } from "./admin/pagination";

export const blogRoutes = new Hono();

function publishedFilter() {
  return and(eq(blogPost.status, "published"), isNotNull(blogPost.publishedAt), lte(blogPost.publishedAt, new Date()));
}

function serializeBlogPostSummary(record: typeof blogPost.$inferSelect): PublicBlogPostSummary {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    authorName: record.authorName,
    category: record.category,
    tags: record.tags,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    coverImage: record.coverImage,
    publishedAt: record.publishedAt?.toISOString() ?? new Date().toISOString(),
  };
}

function serializeBlogPost(record: typeof blogPost.$inferSelect): PublicBlogPost {
  return {
    ...serializeBlogPostSummary(record),
    content: record.content,
  };
}

blogRoutes.get("/api/blog/covers/:imageId", async (c) => {
  try {
    const downloadUrl = await createObjectDownloadUrl(getBlogCoverObjectKey(c.req.param("imageId")));

    return c.redirect(downloadUrl, 302);
  } catch (error) {
    console.error("Failed to create blog cover download URL.", error);

    return c.json({ error: "Cover image not found." }, 404);
  }
});

blogRoutes.get("/api/blog/recent", async (c) => {
  const limit = Math.min(Number(c.req.query("limit") ?? 3) || 3, 6);
  const records = await db
    .select()
    .from(blogPost)
    .where(publishedFilter())
    .orderBy(desc(blogPost.publishedAt))
    .limit(limit);

  return c.json({ posts: records.map(serializeBlogPostSummary) });
});

blogRoutes.get("/api/blog", async (c) => {
  const pagination = parsePaginationParams(c.req.query("page"), c.req.query("limit"));
  const filter = publishedFilter();
  const [{ total }] = await db.select({ total: count() }).from(blogPost).where(filter);
  const records = await db
    .select()
    .from(blogPost)
    .where(filter)
    .orderBy(desc(blogPost.publishedAt))
    .limit(pagination.pageSize)
    .offset(getPaginationOffset(pagination));

  return c.json({
    posts: records.map(serializeBlogPostSummary),
    pagination: getPaginationMeta(total, pagination),
  });
});

blogRoutes.get("/api/blog/:slug", async (c) => {
  const record = await db.query.blogPost.findFirst({
    where: and(publishedFilter(), eq(blogPost.slug, c.req.param("slug"))),
  });

  if (!record) {
    return c.json({ error: "Blog post not found." }, 404);
  }

  return c.json({ post: serializeBlogPost(record) });
});
