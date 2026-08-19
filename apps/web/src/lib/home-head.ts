import type { PublicRecentBlogPostsResponse } from "@repo/types/blog";

export function homeHead({ loaderData }: { loaderData: PublicRecentBlogPostsResponse }) {
  void loaderData;

  return {
    meta: [
      { title: "The Baseplate" },
      {
        name: "description",
        content:
          "Start new projects from a working backend, dashboard, database, worker, public site, publishing workflow, and theme system.",
      },
    ],
  };
}
