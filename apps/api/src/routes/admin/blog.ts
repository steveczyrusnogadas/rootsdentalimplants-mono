import {
  blogCoverUploadPayloadSchema,
  blogPostStatusSchema,
  createAdminBlogPostPayloadSchema,
  updateAdminBlogPostPayloadSchema,
  type AdminBlogPost,
  type BlogPostStatus,
} from "@repo/types/admin/blog";
import { and, asc, count, desc, eq, ilike, ne, or } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../database/client";
import { blogPost } from "../../database/schema";
import { getAdminSession } from "../../shared/admin-session";
import {
  createBlogCoverUploadUrl,
  isAllowedImageContentType,
  maxBlogCoverSizeBytes,
} from "../../storage/s3";
import { parseListQueryParams } from "./list-query";
import { getPaginationMeta, getPaginationOffset, parsePaginationParams } from "./pagination";

export const adminBlogRoutes = new Hono();

const blogSortColumns = {
  title: blogPost.title,
  status: blogPost.status,
  authorName: blogPost.authorName,
  publishedAt: blogPost.publishedAt,
  createdAt: blogPost.createdAt,
  updatedAt: blogPost.updatedAt,
} as const;
const blogSortKeys = Object.keys(blogSortColumns) as Array<keyof typeof blogSortColumns>;

function serializeBlogPost(record: typeof blogPost.$inferSelect): AdminBlogPost {
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
    coverImageKey: record.coverImageKey,
    status: blogPostStatusSchema.catch("draft").parse(record.status),
    content: record.content,
    publishedAt: record.publishedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function getSchemaError(error: { issues: Array<{ message: string }> }, fallback: string) {
  return error.issues[0]?.message ?? fallback;
}

function parseStatusFilter(value: string | undefined) {
  if (!value || value === "all") {
    return null;
  }

  const result = blogPostStatusSchema.safeParse(value);

  return result.success ? result.data : null;
}

async function ensureUniqueSlug(slug: string, id?: string) {
  const existing = await db.query.blogPost.findFirst({
    where: id ? and(eq(blogPost.slug, slug), ne(blogPost.id, id)) : eq(blogPost.slug, slug),
  });

  if (existing) {
    throw new Error("Slug is already in use.");
  }
}

function getPublishedAt(status: BlogPostStatus, value: string | null | undefined, current?: Date | null) {
  if (status === "draft") {
    return null;
  }

  if (value) {
    return new Date(value);
  }

  return current ?? new Date();
}

adminBlogRoutes.get("/api/admin/blog", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const pagination = parsePaginationParams(c.req.query("page"), c.req.query("limit"));
  const listQuery = parseListQueryParams({
    search: c.req.query("search"),
    sortBy: c.req.query("sortBy"),
    sortDir: c.req.query("sortDir"),
    allowedSorts: blogSortKeys,
    defaultSortBy: "updatedAt",
  });
  const status = parseStatusFilter(c.req.query("status"));
  const statusFilter = status ? eq(blogPost.status, status) : undefined;
  const searchFilter = listQuery.search
    ? or(
        ilike(blogPost.title, `%${listQuery.search}%`),
        ilike(blogPost.slug, `%${listQuery.search}%`),
        ilike(blogPost.excerpt, `%${listQuery.search}%`),
        ilike(blogPost.authorName, `%${listQuery.search}%`),
        ilike(blogPost.category, `%${listQuery.search}%`),
      )
    : undefined;
  const filter = statusFilter && searchFilter ? and(statusFilter, searchFilter) : (statusFilter ?? searchFilter);
  const sortColumn = blogSortColumns[listQuery.sortBy];
  const orderBy = listQuery.sortDir === "asc" ? asc(sortColumn) : desc(sortColumn);
  const [{ total }] = filter
    ? await db.select({ total: count() }).from(blogPost).where(filter)
    : await db.select({ total: count() }).from(blogPost);
  const records = filter
    ? await db
        .select()
        .from(blogPost)
        .where(filter)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination))
    : await db
        .select()
        .from(blogPost)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination));

  return c.json({
    posts: records.map(serializeBlogPost),
    pagination: getPaginationMeta(total, pagination),
  });
});

adminBlogRoutes.get("/api/admin/blog/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const record = await db.query.blogPost.findFirst({
    where: eq(blogPost.id, c.req.param("id")),
  });

  if (!record) {
    return c.json({ error: "Blog post not found." }, 404);
  }

  return c.json({ post: serializeBlogPost(record) });
});

adminBlogRoutes.post("/api/admin/blog", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const result = createAdminBlogPostPayloadSchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: getSchemaError(result.error, "Invalid blog post details.") }, 400);
    }

    await ensureUniqueSlug(result.data.slug);

    const now = new Date();
    const status = result.data.status;
    const [createdPost] = await db
      .insert(blogPost)
      .values({
        id: crypto.randomUUID(),
        title: result.data.title,
        slug: result.data.slug,
        excerpt: result.data.excerpt,
        authorName: result.data.authorName,
        category: result.data.category,
        tags: result.data.tags,
        seoTitle: result.data.seoTitle,
        seoDescription: result.data.seoDescription,
        coverImage: result.data.coverImage,
        coverImageKey: result.data.coverImageKey,
        status,
        content: result.data.content,
        publishedAt: getPublishedAt(status, result.data.publishedAt),
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return c.json({ post: serializeBlogPost(createdPost) }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create blog post.";

    return c.json({ error: message }, 400);
  }
});

adminBlogRoutes.patch("/api/admin/blog/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const existingPost = await db.query.blogPost.findFirst({
      where: eq(blogPost.id, c.req.param("id")),
    });

    if (!existingPost) {
      return c.json({ error: "Blog post not found." }, 404);
    }

    const result = updateAdminBlogPostPayloadSchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: getSchemaError(result.error, "Invalid blog post details.") }, 400);
    }

    if (result.data.slug) {
      await ensureUniqueSlug(result.data.slug, existingPost.id);
    }

    const nextStatus = result.data.status ?? (existingPost.status as BlogPostStatus);
    const updates: Partial<typeof blogPost.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (result.data.title !== undefined) updates.title = result.data.title;
    if (result.data.slug !== undefined) updates.slug = result.data.slug;
    if (result.data.excerpt !== undefined) updates.excerpt = result.data.excerpt;
    if (result.data.authorName !== undefined) updates.authorName = result.data.authorName;
    if (result.data.category !== undefined) updates.category = result.data.category;
    if (result.data.tags !== undefined) updates.tags = result.data.tags;
    if (result.data.seoTitle !== undefined) updates.seoTitle = result.data.seoTitle;
    if (result.data.seoDescription !== undefined) updates.seoDescription = result.data.seoDescription;
    if (result.data.coverImage !== undefined) updates.coverImage = result.data.coverImage;
    if (result.data.coverImageKey !== undefined) updates.coverImageKey = result.data.coverImageKey;
    if (result.data.content !== undefined) updates.content = result.data.content;
    updates.status = nextStatus;
    updates.publishedAt = getPublishedAt(nextStatus, result.data.publishedAt, existingPost.publishedAt);

    const [updatedPost] = await db
      .update(blogPost)
      .set(updates)
      .where(eq(blogPost.id, existingPost.id))
      .returning();

    return c.json({ post: serializeBlogPost(updatedPost) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update blog post.";

    return c.json({ error: message }, 400);
  }
});

adminBlogRoutes.delete("/api/admin/blog/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const [deletedPost] = await db.delete(blogPost).where(eq(blogPost.id, c.req.param("id"))).returning();

  if (!deletedPost) {
    return c.json({ error: "Blog post not found." }, 404);
  }

  return c.json({ post: serializeBlogPost(deletedPost) });
});

adminBlogRoutes.post("/api/admin/blog/cover-upload", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const result = blogCoverUploadPayloadSchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: getSchemaError(result.error, "Invalid cover image.") }, 400);
    }

    if (!isAllowedImageContentType(result.data.contentType)) {
      return c.json({ error: "Cover image must be a JPEG, PNG, WebP, or GIF image." }, 400);
    }

    if (result.data.size > maxBlogCoverSizeBytes) {
      return c.json({ error: "Cover image must be smaller than 5 MB." }, 400);
    }

    const upload = await createBlogCoverUploadUrl({
      contentType: result.data.contentType,
    });

    return c.json({
      ...upload,
      method: "PUT",
      maxSize: maxBlogCoverSizeBytes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to prepare cover image upload.";

    return c.json({ error: message }, 400);
  }
});
