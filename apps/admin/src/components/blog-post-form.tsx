import type {
  AdminBlogPost,
  AdminBlogPostResponse,
  BlogContent,
  BlogPostStatus,
  CreateAdminBlogPostPayload,
} from "@repo/types/admin/blog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import { toast } from "@repo/ui/components/sonner";
import { BlogEditor } from "@/components/blog-editor";
import { MediaPicker } from "@/components/media-picker";
import {
  blogStatusLabels,
  emptyBlogContent,
  formatTags,
  parseTags,
  slugifyTitle,
} from "@/lib/admin-blog";
import { adminApi, resolveApiUrl } from "@/lib/api";
import { adminBlogKeys } from "@/lib/query-keys";

type BlogPostFormProps = {
  post?: AdminBlogPost | null;
};

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  category: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  coverImage: string;
  coverImageKey: string;
  content: BlogContent;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  authorName: "",
  category: "",
  tags: "",
  seoTitle: "",
  seoDescription: "",
  coverImage: "",
  coverImageKey: "",
  content: emptyBlogContent,
};

function getInitialForm(post?: AdminBlogPost | null): FormState {
  if (!post) {
    return emptyForm;
  }

  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    authorName: post.authorName,
    category: post.category ?? "",
    tags: formatTags(post.tags),
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
    coverImage: post.coverImage ?? "",
    coverImageKey: post.coverImageKey ?? "",
    content: post.content,
  };
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => getInitialForm(post));
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

  useEffect(() => {
    setForm(getInitialForm(post));
    setSlugTouched(Boolean(post));
  }, [post]);

  const saveMutation = useMutation({
    mutationFn: async (status: BlogPostStatus) => {
      const payload: CreateAdminBlogPostPayload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        authorName: form.authorName,
        category: form.category || null,
        tags: parseTags(form.tags),
        seoTitle: form.seoTitle || null,
        seoDescription: form.seoDescription || null,
        coverImage: form.coverImage || null,
        coverImageKey: form.coverImageKey || null,
        status,
        content: form.content,
        publishedAt: status === "published" ? (post?.publishedAt ?? new Date().toISOString()) : null,
      };
      const data = await adminApi<AdminBlogPostResponse>(
        post ? `/api/admin/blog/${post.id}` : "/api/admin/blog",
        {
          method: post ? "PATCH" : "POST",
          body: JSON.stringify(payload),
          errorMessage: "Failed to save blog post.",
        },
      );

      return data.post;
    },
    onSuccess: async (savedPost) => {
      await queryClient.invalidateQueries({ queryKey: adminBlogKeys.lists() });
      queryClient.setQueryData(adminBlogKeys.detail(savedPost.id), savedPost);
      toast.success(savedPost.status === "published" ? "Blog post published." : "Blog post saved.");

      if (!post) {
        await navigate({ to: "/blog/$postId", params: { postId: savedPost.id } });
      }
    },
  });

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateTitle(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugifyTitle(value),
    }));
  }

  const saving = saveMutation.isPending;
  const error = saveMutation.error instanceof Error ? saveMutation.error.message : "";
  const canSave = Boolean(form.title.trim() && form.slug.trim() && form.excerpt.trim() && form.authorName.trim());
  const status = post?.status ?? "draft";

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              {post ? "Edit blog post" : "New blog post"}
            </h1>
            <Badge variant={status === "published" ? "default" : "secondary"}>{blogStatusLabels[status]}</Badge>
          </div>
          <p className="text-muted-foreground">
            Write a marketing-style article and publish it to the public blog.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/blog">Back to blog</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!canSave || saving}
            onClick={() => saveMutation.mutate("draft")}
          >
            {saving ? "Saving..." : "Save draft"}
          </Button>
          <Button
            type="button"
            disabled={!canSave || saving}
            onClick={() => saveMutation.mutate("published")}
          >
            {saving ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {error ? (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Story</CardTitle>
            <CardDescription>Use formatting, links, quotes, code blocks, horizontal rules, and image URLs.</CardDescription>
          </CardHeader>
          <CardContent>
            <BlogEditor
              value={form.content}
              disabled={saving}
              onChange={(content) => updateField("content", content)}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Post details</CardTitle>
              <CardDescription>These fields drive the blog cards and article metadata.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} disabled={saving} onChange={(event) => updateTitle(event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  disabled={saving}
                  onChange={(event) => {
                    setSlugTouched(true);
                    updateField("slug", slugifyTitle(event.target.value));
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  disabled={saving}
                  maxLength={500}
                  onChange={(event) => updateField("excerpt", event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="authorName">Author</Label>
                <Input id="authorName" value={form.authorName} disabled={saving} onChange={(event) => updateField("authorName", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={form.category} disabled={saving} onChange={(event) => updateField("category", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  disabled={saving}
                  placeholder="Product, Engineering, Launch"
                  onChange={(event) => updateField("tags", event.target.value)}
                />
                <p className="text-xs text-muted-foreground">Comma-separated, up to 8 tags.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover image</CardTitle>
              <CardDescription>Choose a hero image from the Media Library for cards and article pages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {form.coverImage ? (
                <img src={resolveApiUrl(form.coverImage)} alt="" className="aspect-video w-full rounded-md border object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                  No cover image
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" disabled={saving} onClick={() => setCoverPickerOpen(true)}>
                  Choose from media
                </Button>
                {form.coverImage ? (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={saving}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        coverImage: "",
                        coverImageKey: "",
                      }))
                    }
                  >
                    Clear
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>Optional title and description for search and social previews.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="seoTitle">SEO title</Label>
                <Input id="seoTitle" value={form.seoTitle} disabled={saving} onChange={(event) => updateField("seoTitle", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seoDescription">SEO description</Label>
                <Textarea
                  id="seoDescription"
                  value={form.seoDescription}
                  disabled={saving}
                  maxLength={300}
                  onChange={(event) => updateField("seoDescription", event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statusPreview">Current status</Label>
                <Select value={status} disabled>
                  <SelectTrigger id="statusPreview">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <MediaPicker
        open={coverPickerOpen}
        title="Choose cover image"
        description="Select an uploaded image for this post cover, or upload a new one."
        selectLabel="Use as cover"
        onOpenChange={setCoverPickerOpen}
        onSelect={(asset) =>
          setForm((current) => ({
            ...current,
            coverImage: asset.url,
            coverImageKey: asset.objectKey,
          }))
        }
      />
    </div>
  );
}
