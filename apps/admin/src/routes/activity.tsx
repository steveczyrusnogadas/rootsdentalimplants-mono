import { createFileRoute, redirect } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import type { AdminAuditEvent, AdminAuditEventsResponse } from "@repo/types/admin/activity";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { AdminDataTable } from "@/components/admin-data-table";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminSortableHeader } from "@/components/admin-sortable-header";
import { AdminTableSearch } from "@/components/admin-table-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { adminApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { adminActivityKeys } from "@/lib/query-keys";

const PAGE_SIZE = 10;

const actionLabels: Record<AdminAuditEvent["action"], string> = {
  "user.created": "User created",
  "user.updated": "User updated",
  "user.deleted": "User deleted",
  "lead.converted": "Lead converted",
  "lead.updated": "Lead updated",
  "lead.deleted": "Lead deleted",
  "contact.created": "Contact created",
  "contact.updated": "Contact updated",
  "profile.updated": "Profile updated",
  "profile.avatar_upload_prepared": "Avatar upload prepared",
};

export const Route = createFileRoute("/activity")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (session?.user.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: ActivityPage,
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMetadata(metadata: Record<string, unknown>) {
  const value = JSON.stringify(metadata);

  return value.length > 120 ? `${value.slice(0, 117)}...` : value;
}

function formatActionLabel(action: AdminAuditEvent["action"]) {
  return actionLabels[action] ?? action.replace(".", " ");
}

function ActivityPage() {
  const [searchInput, setSearchInput] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const search = useDebouncedValue(searchInput).trim();
  const currentSort = sorting[0] ?? { id: "createdAt", desc: true };
  const sortBy = currentSort.id;
  const sortDir = currentSort.desc ? "desc" : "asc";
  const activityQuery = useQuery({
    queryKey: adminActivityKeys.list(paginationState.pageIndex + 1, paginationState.pageSize, search, sortBy, sortDir),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(paginationState.pageIndex + 1),
        limit: String(paginationState.pageSize),
        search,
        sortBy,
        sortDir,
      });

      return adminApi<AdminAuditEventsResponse>(`/api/admin/activity?${params.toString()}`, {
        errorMessage: "Failed to load activity.",
      });
    },
    placeholderData: keepPreviousData,
  });
  const events = activityQuery.data?.events ?? [];
  const pagination = activityQuery.data?.pagination;

  useEffect(() => {
    if (pagination && paginationState.pageIndex + 1 > pagination.totalPages) {
      setPaginationState((current) => ({
        ...current,
        pageIndex: pagination.totalPages - 1,
      }));
    }
  }, [pagination, paginationState.pageIndex]);

  useEffect(() => {
    setPaginationState((current) => (current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }));
  }, [search, sortBy, sortDir]);

  const columns = useMemo<ColumnDef<AdminAuditEvent>[]>(
    () => [
      {
        accessorKey: "action",
        header: ({ column }) => <AdminSortableHeader column={column}>Action</AdminSortableHeader>,
        cell: ({ row }) => <Badge variant="secondary">{formatActionLabel(row.original.action)}</Badge>,
      },
      {
        accessorKey: "entityType",
        header: ({ column }) => <AdminSortableHeader column={column}>Entity</AdminSortableHeader>,
        cell: ({ row }) => (
          <div>
            <div className="font-medium capitalize">{row.original.entityType}</div>
            <div className="text-xs text-muted-foreground">{row.original.entityId ?? "No entity id"}</div>
          </div>
        ),
      },
      {
        accessorKey: "actorEmail",
        header: ({ column }) => <AdminSortableHeader column={column}>Actor</AdminSortableHeader>,
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.actorEmail ?? "Unknown actor"}</div>
            <div className="text-xs text-muted-foreground">{row.original.actorRole ?? "unknown"}</div>
          </div>
        ),
      },
      {
        accessorKey: "metadata",
        header: "Metadata",
        enableSorting: false,
        cell: ({ row }) => (
          <code className="block max-w-[360px] truncate rounded bg-muted px-2 py-1 text-xs">
            {formatMetadata(row.original.metadata)}
          </code>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <AdminSortableHeader column={column}>Recorded</AdminSortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
      },
    ],
    [],
  );
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: pagination?.totalPages ?? -1,
    state: {
      pagination: paginationState,
      sorting,
    },
    onPaginationChange: setPaginationState,
    onSortingChange: setSorting,
  });
  const error = activityQuery.error instanceof Error ? activityQuery.error.message : "";

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Activity</h1>
        <p className="mt-1 text-muted-foreground">Admin-side changes recorded for debugging and accountability.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>User, lead, profile, and avatar activity from admin workflows.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AdminTableSearch value={searchInput} onChange={setSearchInput} placeholder="Search activity..." />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
          <AdminDataTable table={table} emptyMessage="No activity recorded yet." isLoading={activityQuery.isPending} />
          {pagination ? (
            <AdminPagination
              pagination={pagination}
              disabled={activityQuery.isFetching}
              onPageChange={(page) => setPaginationState((current) => ({ ...current, pageIndex: page - 1 }))}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
