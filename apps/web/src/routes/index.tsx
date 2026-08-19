import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";
import { HOME_RECENT_LIMIT, recentBlogPostsQuery } from "@/lib/blog-queries";
import { homeHead } from "@/lib/home-head";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(recentBlogPostsQuery(HOME_RECENT_LIMIT)),
  head: homeHead,
  component: App,
});
