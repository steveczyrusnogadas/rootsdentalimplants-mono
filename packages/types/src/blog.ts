import { z } from "zod";
import { blogContentSchema } from "./admin/blog.js";
import { paginationMetaSchema } from "./admin/users.js";

export const publicBlogPostSummarySchema = z.object({
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
  publishedAt: z.string(),
});

export const publicBlogPostSchema = publicBlogPostSummarySchema.extend({
  content: blogContentSchema,
});

export const publicBlogPostsResponseSchema = z.object({
  posts: z.array(publicBlogPostSummarySchema),
  pagination: paginationMetaSchema,
});

export const publicRecentBlogPostsResponseSchema = z.object({
  posts: z.array(publicBlogPostSummarySchema),
});

export const publicBlogPostResponseSchema = z.object({
  post: publicBlogPostSchema,
});

export type PublicBlogPostSummary = z.infer<typeof publicBlogPostSummarySchema>;
export type PublicBlogPost = z.infer<typeof publicBlogPostSchema>;
export type PublicBlogPostsResponse = z.infer<typeof publicBlogPostsResponseSchema>;
export type PublicRecentBlogPostsResponse = z.infer<typeof publicRecentBlogPostsResponseSchema>;
export type PublicBlogPostResponse = z.infer<typeof publicBlogPostResponseSchema>;
