import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { AdminBlogPostResponse } from "@repo/types/admin/blog";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { BlogPostForm } from "@/components/blog-post-form";
import { adminApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { adminBlogKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/blog/$postId")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    const role = session?.user.role;

    if (role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: EditBlogPostPage,
});

function EditBlogPostPage() {
  const { postId } = useParams({ from: "/blog/$postId" });
  const postQuery = useQuery({
    queryKey: adminBlogKeys.detail(postId),
    queryFn: async () => {
      const data = await adminApi<AdminBlogPostResponse>(`/api/admin/blog/${postId}`, {
        errorMessage: "Failed to load blog post.",
      });

      return data.post;
    },
  });

  if (postQuery.isPending) {
    return <div className="p-6 text-muted-foreground">Loading blog post...</div>;
  }

  if (postQuery.error instanceof Error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{postQuery.error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <BlogPostForm post={postQuery.data} />;
}
