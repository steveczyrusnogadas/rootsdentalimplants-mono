import type { AdminBlogPost, BlogContent, BlogPostStatus } from "@repo/types/admin/blog";

export type { AdminBlogPost, BlogContent, BlogPostStatus };

export type BlogStatusFilter = "all" | BlogPostStatus;

export const blogStatusLabels: Record<BlogPostStatus, string> = {
  draft: "Draft",
  published: "Published",
};

export const blogStatusFilterLabels: Record<BlogStatusFilter, string> = {
  all: "All posts",
  draft: "Drafts",
  published: "Published",
};

export const emptyBlogContent: BlogContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

export function formatBlogDate(value: string | null) {
  if (!value) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function slugifyTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function formatTags(tags: string[]) {
  return tags.join(", ");
}

export function getBlogStatusVariant(status: BlogPostStatus) {
  return status === "published" ? "default" : "secondary";
}

export function getBlogPostUrl(post: AdminBlogPost) {
  return `/blog/${post.slug}`;
}
