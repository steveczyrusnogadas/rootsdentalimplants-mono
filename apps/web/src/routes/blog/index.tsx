import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { PublicBlogPostSummary } from "@repo/types/blog";
import { useState } from "react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { resolveApiUrl } from "@/lib/api";
import { blogListHead } from "@/lib/blog-list-head";
import { BLOG_LIST_PAGE_SIZE, blogListQuery } from "@/lib/blog-queries";

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(blogListQuery(1, BLOG_LIST_PAGE_SIZE)),
  head: blogListHead,
  component: BlogIndexPage,
});

function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function BlogCard({ post }: { post: PublicBlogPostSummary }) {
  return (
    <Card className="overflow-hidden">
      {post.coverImage ? (
        <img src={resolveApiUrl(post.coverImage)} alt="" className="aspect-video w-full object-cover" />
      ) : null}
      <CardHeader>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {post.category ? (
            <Badge variant="secondary" className="text-[0.6rem] tracking-[0.15em] uppercase">
              {post.category}
            </Badge>
          ) : null}
          <span className="text-xs text-muted-foreground">{formatPostDate(post.publishedAt)}</span>
        </div>
        <CardTitle className="font-heading text-2xl leading-tight">
          <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-primary">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="leading-relaxed">{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BlogIndexPage() {
  const [page, setPage] = useState(1);
  const { data } = useSuspenseQuery(blogListQuery(page, BLOG_LIST_PAGE_SIZE));
  const posts = data.posts;
  const pagination = data.pagination;

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col items-center gap-3 pb-6">
          <div className="w-full border-t border-foreground/20" />
          <div className="flex w-full items-center justify-between py-2">
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Editorial
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">The Baseplate</h2>
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">Blog</span>
          </div>
          <div className="w-full border-t border-foreground/20" />
        </header>

        <section className="mb-16">
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            Recent writing
          </p>
          <h1 className="font-heading mt-3 text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
            Notes, launches, and field reports.
          </h1>
          <p className="font-heading mt-6 max-w-3xl text-xl font-medium italic text-muted-foreground md:text-2xl">
            Updates from the admin workspace, product surface, and engineering decisions behind Baseplate.
          </p>
        </section>

        <Separator className="mb-16" />

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </section>

        {posts.length === 0 ? (
          <div className="border border-dashed p-10 text-center text-muted-foreground">
            No published blog posts yet.
          </div>
        ) : null}

        <div className="mt-10 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
