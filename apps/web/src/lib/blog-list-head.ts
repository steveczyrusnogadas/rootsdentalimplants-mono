import type { PublicBlogPostsResponse } from "@repo/types/blog";

export function blogListHead({ loaderData }: { loaderData?: PublicBlogPostsResponse }) {
  void loaderData;

  return {
    meta: [
      { title: "Blog · The Baseplate" },
      {
        name: "description",
        content: "Updates from the admin workspace, product surface, and engineering decisions behind Baseplate.",
      },
    ],
  };
}
