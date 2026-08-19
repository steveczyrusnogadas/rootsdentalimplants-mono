import { createFileRoute, redirect } from "@tanstack/react-router";
import { BlogPostForm } from "@/components/blog-post-form";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/blog/new")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    const role = session?.user.role;

    if (role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: NewBlogPostPage,
});

function NewBlogPostPage() {
  return <BlogPostForm />;
}
