import type { PublicBlogPostResponse, PublicBlogPostsResponse, PublicRecentBlogPostsResponse } from "@repo/types/blog";
import { ApiError, apiJson } from "./api";
import { blogKeys } from "./query-keys";

export const HOME_RECENT_LIMIT = 3;
export const BLOG_LIST_PAGE_SIZE = 9;

export function recentBlogPostsQuery(limit: number) {
  return {
    queryKey: blogKeys.recent(limit),
    queryFn: () =>
      apiJson<PublicRecentBlogPostsResponse>(`/api/blog/recent?limit=${limit}`, {
        errorMessage: "Failed to load recent blog posts.",
      }),
  };
}

export function blogListQuery(page: number, pageSize: number) {
  return {
    queryKey: blogKeys.list(page, pageSize),
    queryFn: () =>
      apiJson<PublicBlogPostsResponse>(`/api/blog?page=${page}&limit=${pageSize}`, {
        errorMessage: "Failed to load blog posts.",
      }),
  };
}

export function blogPostQuery(slug: string) {
  return {
    queryKey: blogKeys.detail(slug),
    queryFn: () =>
      apiJson<PublicBlogPostResponse>(`/api/blog/${encodeURIComponent(slug)}`, {
        errorMessage: "Failed to load blog post.",
      }),
    retry: (failureCount: number, error: Error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }

      return failureCount < 3;
    },
  };
}
