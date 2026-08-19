import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { BlogContent } from "@/components/blog-content";
import { ApiError, resolveApiUrl } from "@/lib/api";
import { blogPostHead } from "@/lib/blog-post-head";
import { blogPostQuery } from "@/lib/blog-queries";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(blogPostQuery(params.slug));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw notFound();
      }

      throw error;
    }
  },
  head: blogPostHead,
  component: BlogPostPage,
});

function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(blogPostQuery(slug));
  const post = data.post;

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col items-center gap-3 pb-6">
          <div className="w-full border-t border-foreground/20" />
          <div className="flex w-full items-center justify-between py-2">
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              {post.category ?? "Article"}
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">The Baseplate</h2>
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              {formatPostDate(post.publishedAt)}
            </span>
          </div>
          <div className="w-full border-t border-foreground/20" />
        </header>

        <article>
          <section className="mx-auto mb-12 max-w-4xl text-center">
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {post.category ? <Badge variant="secondary">{post.category}</Badge> : null}
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
              {post.title}
            </h1>
            <p className="font-heading mx-auto mt-6 max-w-3xl text-xl font-medium italic text-muted-foreground md:text-2xl">
              {post.excerpt}
            </p>
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
              By {post.authorName}
            </p>
          </section>

          {post.coverImage ? (
            <img src={resolveApiUrl(post.coverImage)} alt="" className="mb-16 aspect-video w-full rounded-lg object-cover" />
          ) : null}

          <Separator className="mb-12" />
          <BlogContent content={post.content} />
        </article>

        <div className="mx-auto mt-16 max-w-3xl border-t border-foreground/10 pt-8">
          <Button asChild variant="outline">
            <Link to="/blog">Back to all posts</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
