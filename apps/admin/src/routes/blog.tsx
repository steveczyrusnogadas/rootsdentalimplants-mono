import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import type {
  AdminBlogPost,
  AdminBlogPostResponse,
  AdminBlogPostsResponse,
} from "@repo/types/admin/blog";
import { useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { AdminDataTable } from "@/components/admin-data-table";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminSortableHeader } from "@/components/admin-sortable-header";
import { AdminTableSearch } from "@/components/admin-table-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  blogStatusFilterLabels,
  blogStatusLabels,
  formatBlogDate,
  getBlogStatusVariant,
  type BlogStatusFilter,
} from "@/lib/admin-blog";
import { adminApi, resolveApiUrl } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { adminBlogKeys } from "@/lib/query-keys";

const PAGE_SIZE = 10;

export const Route = createFileRoute("/blog")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    const role = session?.user.role;

    if (role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: BlogPage,
});

function BlogPage() {
  const navigate = useNavigate();
  const isBlogChildRoute = useRouterState({
    select: (state) => state.location.pathname.startsWith("/blog/"),
  });
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<BlogStatusFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "updatedAt", desc: true }]);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [postToDelete, setPostToDelete] = useState<AdminBlogPost | null>(null);
  const search = useDebouncedValue(searchInput).trim();
  const currentSort = sorting[0] ?? { id: "updatedAt", desc: true };
  const sortBy = currentSort.id;
  const sortDir = currentSort.desc ? "desc" : "asc";
  const blogQuery = useQuery({
    queryKey: adminBlogKeys.list(status, paginationState.pageIndex + 1, paginationState.pageSize, search, sortBy, sortDir),
    queryFn: async () => {
      const params = new URLSearchParams({
        status,
        page: String(paginationState.pageIndex + 1),
        limit: String(paginationState.pageSize),
        search,
        sortBy,
        sortDir,
      });

      return adminApi<AdminBlogPostsResponse>(`/api/admin/blog?${params.toString()}`, {
        errorMessage: "Failed to load blog posts.",
      });
    },
    placeholderData: keepPreviousData,
  });
  const posts = blogQuery.data?.posts ?? [];
  const pagination = blogQuery.data?.pagination;

  useEffect(() => {
    if (pagination && paginationState.pageIndex + 1 > pagination.totalPages) {
      setPaginationState((current) => ({
        ...current,
        pageIndex: Math.max(pagination.totalPages - 1, 0),
      }));
    }
  }, [pagination, paginationState.pageIndex]);

  useEffect(() => {
    setPaginationState((current) => (current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }));
  }, [search, sortBy, sortDir, status]);

  const deleteMutation = useMutation({
    mutationFn: async (post: AdminBlogPost) => {
      await adminApi<AdminBlogPostResponse>(`/api/admin/blog/${post.id}`, {
        method: "DELETE",
        errorMessage: "Failed to delete blog post.",
      });

      return post;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminBlogKeys.lists() });
    },
  });
  const saving = deleteMutation.isPending;
  const loading = blogQuery.isPending;
  const error =
    (deleteMutation.error instanceof Error ? deleteMutation.error.message : "") ||
    (blogQuery.error instanceof Error ? blogQuery.error.message : "");
  const columns = useMemo<ColumnDef<AdminBlogPost>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => <AdminSortableHeader column={column}>Post</AdminSortableHeader>,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.coverImage ? (
              <img
                src={resolveApiUrl(row.original.coverImage)}
                alt=""
                className="h-14 w-20 shrink-0 border object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-14 w-20 shrink-0 items-center justify-center border bg-muted text-xs text-muted-foreground">
                No image
              </div>
            )}
            <div className="min-w-0">
              <div className="font-medium">{row.original.title}</div>
              <div className="text-sm text-muted-foreground">/{row.original.slug}</div>
              <div className="mt-1 max-w-lg truncate text-xs text-muted-foreground">{row.original.excerpt}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => <AdminSortableHeader column={column}>Status</AdminSortableHeader>,
        cell: ({ row }) => (
          <Badge variant={getBlogStatusVariant(row.original.status)}>{blogStatusLabels[row.original.status]}</Badge>
        ),
      },
      {
        accessorKey: "authorName",
        header: ({ column }) => <AdminSortableHeader column={column}>Author</AdminSortableHeader>,
      },
      {
        accessorKey: "publishedAt",
        header: ({ column }) => <AdminSortableHeader column={column}>Published</AdminSortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{formatBlogDate(row.original.publishedAt)}</span>,
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => <AdminSortableHeader column={column}>Updated</AdminSortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{formatBlogDate(row.original.updatedAt)}</span>,
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                void navigate({ to: "/blog/$postId", params: { postId: row.original.id } });
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={saving}
              onClick={(event) => {
                event.stopPropagation();
                setPostToDelete(row.original);
              }}
            >
              <Trash2Icon />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [navigate, saving],
  );
  const table = useReactTable({
    data: posts,
    columns,
    state: {
      sorting,
      pagination: paginationState,
    },
    pageCount: pagination?.totalPages ?? -1,
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onPaginationChange: setPaginationState,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isBlogChildRoute) {
    return <Outlet />;
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Blog</h1>
          <p className="mt-1 text-muted-foreground">Draft, publish, and manage public marketing articles.</p>
        </div>
        <Button asChild>
          <Link to="/blog/new">
            <PlusIcon />
            New post
          </Link>
        </Button>
      </div>

      {error ? (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Posts</CardTitle>
            <CardDescription>Search, filter, and open posts for editing.</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <AdminTableSearch value={searchInput} onChange={setSearchInput} placeholder="Search posts..." />
            <Select value={status} onValueChange={(value) => setStatus(value as BlogStatusFilter)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{blogStatusFilterLabels.all}</SelectItem>
                <SelectItem value="draft">{blogStatusFilterLabels.draft}</SelectItem>
                <SelectItem value="published">{blogStatusFilterLabels.published}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            table={table}
            emptyMessage={loading ? "Loading posts..." : "No blog posts found."}
            isLoading={loading}
            getRowProps={(row) => ({
              className: "cursor-pointer",
              onClick: () => void navigate({ to: "/blog/$postId", params: { postId: row.original.id } }),
            })}
          />
          {pagination ? (
            <AdminPagination
              pagination={pagination}
              disabled={loading}
              onPageChange={(page) =>
                setPaginationState((current) => ({
                  ...current,
                  pageIndex: page - 1,
                }))
              }
            />
          ) : null}
        </CardContent>
      </Card>

      <AlertDialog open={Boolean(postToDelete)} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blog post?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes "{postToDelete?.title}". Published pages for this post will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(event) => {
                event.preventDefault();
                if (postToDelete) {
                  deleteMutation.mutate(postToDelete, {
                    onSuccess: () => setPostToDelete(null),
                  });
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
