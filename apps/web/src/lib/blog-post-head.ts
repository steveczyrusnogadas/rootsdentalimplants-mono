import type { PublicBlogPostResponse } from "@repo/types/blog";
import { resolveApiUrl } from "./api";

export function blogPostHead({ loaderData }: { loaderData: PublicBlogPostResponse }) {
  const title = loaderData.post.seoTitle ?? loaderData.post.title;
  const description = loaderData.post.seoDescription ?? loaderData.post.excerpt;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      ...(loaderData.post.coverImage ?
        [{ property: "og:image", content: resolveApiUrl(loaderData.post.coverImage) }]
      : []),
    ],
  };
}
