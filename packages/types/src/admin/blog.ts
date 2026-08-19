import { z } from "zod";
import { paginationMetaSchema } from "./users.js";

export const blogPostStatusSchema = z.enum(["draft", "published"]);

export const blogContentSchema = z
  .object({
    type: z.string(),
    content: z.array(z.unknown()).optional(),
  })
  .passthrough();

export const adminBlogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  authorName: z.string(),
  category: z.string().nullable(),
  tags: z.array(z.string()),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  coverImage: z.string().nullable(),
  coverImageKey: z.string().nullable(),
  status: blogPostStatusSchema,
  content: blogContentSchema,
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const adminBlogPostsResponseSchema = z.object({
  posts: z.array(adminBlogPostSchema),
  pagination: paginationMetaSchema,
});

export const adminBlogPostResponseSchema = z.object({
  post: adminBlogPostSchema,
});

const requiredString = (field: string, maxLength: number) =>
  z.string().trim().min(1, `${field} is required.`).max(maxLength, `${field} is too long.`);

const optionalString = (field: string, maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `${field} is too long.`)
    .optional()
    .nullable()
    .transform((value) => (value ? value : null));

const tagsSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(8, "Use 8 tags or fewer.")
  .default([]);

export const createAdminBlogPostPayloadSchema = z.object({
  title: requiredString("Title", 180),
  slug: requiredString("Slug", 180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens."),
  excerpt: requiredString("Excerpt", 500),
  authorName: requiredString("Author", 120),
  category: optionalString("Category", 80),
  tags: tagsSchema,
  seoTitle: optionalString("SEO title", 180),
  seoDescription: optionalString("SEO description", 300),
  coverImage: optionalString("Cover image", 1000),
  coverImageKey: optionalString("Cover image key", 500),
  status: blogPostStatusSchema.default("draft"),
  content: blogContentSchema,
  publishedAt: z.string().datetime().optional().nullable(),
});

export const updateAdminBlogPostPayloadSchema = createAdminBlogPostPayloadSchema.partial().extend({
  status: blogPostStatusSchema.optional(),
});

export const blogCoverUploadPayloadSchema = z.object({
  contentType: requiredString("Content type", 120),
  size: z.number().positive("Image size is invalid."),
});

export type BlogPostStatus = z.infer<typeof blogPostStatusSchema>;
export type BlogContent = z.infer<typeof blogContentSchema>;
export type AdminBlogPost = z.infer<typeof adminBlogPostSchema>;
export type AdminBlogPostsResponse = z.infer<typeof adminBlogPostsResponseSchema>;
export type AdminBlogPostResponse = z.infer<typeof adminBlogPostResponseSchema>;
export type CreateAdminBlogPostPayload = z.infer<typeof createAdminBlogPostPayloadSchema>;
export type UpdateAdminBlogPostPayload = z.infer<typeof updateAdminBlogPostPayloadSchema>;
export type BlogCoverUploadPayload = z.infer<typeof blogCoverUploadPayloadSchema>;
