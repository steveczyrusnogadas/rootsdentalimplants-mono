import { createFileRoute, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import type { PaginationMeta } from "@repo/types/admin/users";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import { ArchiveIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { AdminDataTable } from "@/components/admin-data-table";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminSortableHeader } from "@/components/admin-sortable-header";
import { AdminTableSearch } from "@/components/admin-table-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { adminApi } from "@/lib/api";
import {
  formatLeadDate,
  formatLeadSource,
  getLeadPriorityVariant,
  getLeadStatusVariant,
  priorityLabels,
  statusLabels,
  viewLabels,
  type AdminLead,
  type LeadPriority,
  type LeadResponse,
  type LeadStatus,
  type LeadsView,
} from "@/lib/admin-leads";
import { adminAndManagerRoles, hasRoleAccess } from "@/lib/admin-roles";
import { authClient } from "@/lib/auth-client";
import { adminActivityKeys, adminContactKeys, adminLeadKeys, dashboardKeys } from "@/lib/query-keys";

type LeadFormState = {
  status: LeadStatus;
  priority: LeadPriority;
  internalNotes: string;
  archived: boolean;
};

type LeadsResponse = {
  leads: AdminLead[];
  pagination: PaginationMeta;
};

const PAGE_SIZE = 10;

export const Route = createFileRoute("/leads")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    const role = session?.user.role;

    if (!hasRoleAccess(role, adminAndManagerRoles)) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LeadsPage,
});

function LeadsPage() {
  const navigate = useNavigate();
  const isLeadDetailRoute = useRouterState({
    select: (state) => state.location.pathname.startsWith("/leads/"),
  });
  const queryClient = useQueryClient();
  const [view, setView] = useState<LeadsView>("active");
  const [searchInput, setSearchInput] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<AdminLead | null>(null);
  const [conversionMessage, setConversionMessage] = useState("");
  const leadForm = useForm({
    defaultValues: {
      status: "new",
      priority: "normal",
      internalNotes: "",
      archived: false,
    } as LeadFormState,
    onSubmit: async ({ value }) => {
      if (!selectedLead) {
        return;
      }

      const updatedLead = await updateLeadMutation.mutateAsync({ lead: selectedLead, updates: value });

      if (value.status === "converted" && updatedLead.convertedContact) {
        setConversionMessage(`Converted to contact ${updatedLead.convertedContact.name}.`);
      }

      setSelectedLead(null);
    },
  });
  const search = useDebouncedValue(searchInput).trim();
  const currentSort = sorting[0] ?? { id: "createdAt", desc: true };
  const sortBy = currentSort.id;
  const sortDir = currentSort.desc ? "desc" : "asc";
  const leadsQuery = useQuery({
    queryKey: adminLeadKeys.list(view, paginationState.pageIndex + 1, paginationState.pageSize, search, sortBy, sortDir),
    queryFn: async () => {
      const params = new URLSearchParams({
        view,
        page: String(paginationState.pageIndex + 1),
        limit: String(paginationState.pageSize),
        search,
        sortBy,
        sortDir,
      });

      return adminApi<LeadsResponse>(`/api/admin/leads?${params.toString()}`, {
        errorMessage: "Failed to load leads.",
      });
    },
    placeholderData: keepPreviousData,
  });

  const leads = leadsQuery.data?.leads ?? [];
  const pagination = leadsQuery.data?.pagination;

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

  const setLeadFormValues = useCallback((value: LeadFormState) => {
    leadForm.setFieldValue("status", value.status);
    leadForm.setFieldValue("priority", value.priority);
    leadForm.setFieldValue("internalNotes", value.internalNotes);
    leadForm.setFieldValue("archived", value.archived);
  }, [leadForm]);

  const openLeadDialog = useCallback((lead: AdminLead) => {
    const formValue = {
      status: lead.status,
      priority: lead.priority,
      internalNotes: lead.internalNotes ?? "",
      archived: Boolean(lead.archivedAt),
    };

    setSelectedLead(lead);
    leadForm.reset(formValue);
    setLeadFormValues(formValue);
  }, [leadForm, setLeadFormValues]);

  const updateLeadMutation = useMutation({
    mutationFn: async ({ lead, updates }: { lead: AdminLead; updates: Partial<LeadFormState> }) => {
      const data = await adminApi<LeadResponse>(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
        errorMessage: "Failed to update lead.",
      });

      return data.lead;
    },
    onSuccess: (lead) => {
      queryClient.setQueryData(adminLeadKeys.detail(lead.id), lead);
      void queryClient.invalidateQueries({ queryKey: adminLeadKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: adminContactKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
      void queryClient.invalidateQueries({ queryKey: adminActivityKeys.lists() });
    },
  });

  const toggleArchive = useCallback(async (lead: AdminLead) => {
    await updateLeadMutation.mutateAsync({ lead, updates: { archived: !lead.archivedAt } }).catch(() => null);
  }, [updateLeadMutation]);

  const deleteLeadMutation = useMutation({
    mutationFn: async (lead: AdminLead) => {
      await adminApi<LeadResponse>(`/api/admin/leads/${lead.id}`, {
        method: "DELETE",
        errorMessage: "Failed to delete lead.",
      });
      return lead;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLeadKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: adminActivityKeys.lists() });
    },
  });
  const saving = updateLeadMutation.isPending || deleteLeadMutation.isPending;
  const loading = leadsQuery.isPending;
  const error =
    (updateLeadMutation.error instanceof Error ? updateLeadMutation.error.message : "") ||
    (deleteLeadMutation.error instanceof Error ? deleteLeadMutation.error.message : "") ||
    (leadsQuery.error instanceof Error ? leadsQuery.error.message : "");
  const columns = useMemo<ColumnDef<AdminLead>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <AdminSortableHeader column={column}>Lead</AdminSortableHeader>,
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
            <div className="mt-1 max-w-xs truncate text-xs text-muted-foreground">{row.original.message}</div>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        enableSorting: false,
        header: "Phone",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.phone || "—"}</span>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => <AdminSortableHeader column={column}>Status</AdminSortableHeader>,
        cell: ({ row }) => (
          <Badge variant={getLeadStatusVariant(row.original.status)}>{statusLabels[row.original.status]}</Badge>
        ),
      },
      {
        accessorKey: "priority",
        header: ({ column }) => <AdminSortableHeader column={column}>Priority</AdminSortableHeader>,
        cell: ({ row }) => (
          <Badge variant={getLeadPriorityVariant(row.original.priority)}>{priorityLabels[row.original.priority]}</Badge>
        ),
      },
      {
        accessorKey: "source",
        header: ({ column }) => <AdminSortableHeader column={column}>Source</AdminSortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{formatLeadSource(row.original.source)}</span>,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <AdminSortableHeader column={column}>Created</AdminSortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{formatLeadDate(row.original.createdAt)}</span>,
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div
            className="flex justify-end gap-2"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Button variant="outline" size="sm" onClick={() => openLeadDialog(row.original)}>
              Manage
            </Button>
            <Button variant="outline" size="sm" disabled={saving} onClick={() => void toggleArchive(row.original)}>
              {row.original.archivedAt ? <RotateCcwIcon /> : <ArchiveIcon />}
              {row.original.archivedAt ? "Restore" : "Archive"}
            </Button>
            <Button variant="destructive" size="sm" disabled={saving} onClick={() => setLeadToDelete(row.original)}>
              <Trash2Icon />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [openLeadDialog, saving, toggleArchive],
  );
  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: false,
    enableSortingRemoval: false,
    rowCount: pagination?.total ?? 0,
    state: {
      pagination: paginationState,
      sorting,
      globalFilter: searchInput,
    },
    onGlobalFilterChange: setSearchInput,
    onPaginationChange: setPaginationState,
    onSortingChange: setSorting,
  });

  if (isLeadDetailRoute) {
    return <Outlet />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Leads</h1>
          <p className="mt-1 text-muted-foreground">Manage contact inquiries and customer opportunities.</p>
        </div>
      </div>

      {error ? <div className="mb-4 border border-destructive/40 p-3 text-sm text-destructive">{error}</div> : null}

      {conversionMessage ? (
        <div className="mb-4 border border-border bg-muted/40 p-3 text-sm">{conversionMessage}</div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{viewLabels[view]}</CardTitle>
          <CardDescription>{loading ? "Loading leads..." : `${pagination?.total ?? 0} leads in this view`}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <AdminTableSearch
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search leads by name, email, phone, message, or source..."
            />
            <Select
              value={view}
              onValueChange={(nextView) => {
                setView(nextView as LeadsView);
                setPaginationState((current) => ({ ...current, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Choose view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active leads</SelectItem>
                <SelectItem value="archived">Archived leads</SelectItem>
                <SelectItem value="all">All leads</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AdminDataTable
            table={table}
            emptyMessage="No leads found."
            isLoading={loading}
            getRowProps={(row) => ({
              role: "link",
              tabIndex: 0,
              className: "cursor-pointer transition-colors hover:bg-muted/50 focus-visible:bg-muted/50",
              onClick: () =>
                void navigate({
                  to: "/leads/$leadId",
                  params: { leadId: row.original.id },
                }),
              onKeyDown: (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  void navigate({
                    to: "/leads/$leadId",
                    params: { leadId: row.original.id },
                  });
                }
              },
            })}
          />
          {pagination ? (
            <AdminPagination
              pagination={pagination}
              disabled={leadsQuery.isFetching}
              onPageChange={(page) => setPaginationState((current) => ({ ...current, pageIndex: page - 1 }))}
            />
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedLead)} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage lead</DialogTitle>
            <DialogDescription>Update lead status, priority, notes, and archive state.</DialogDescription>
          </DialogHeader>
          {selectedLead ? (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void leadForm.handleSubmit();
              }}
            >
              <div className="border border-border p-4 text-sm">
                <div className="font-medium">{selectedLead.name}</div>
                <div className="text-muted-foreground">{selectedLead.email}</div>
                {selectedLead.phone ? <div className="text-muted-foreground">{selectedLead.phone}</div> : null}
                <p className="mt-3 leading-relaxed">{selectedLead.message}</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lead-status">Status</Label>
                <leadForm.Field name="status">
                  {(field) => (
                    <Select value={field.state.value} onValueChange={(status) => field.handleChange(status as LeadStatus)}>
                      <SelectTrigger id="lead-status" className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="unqualified">Unqualified</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </leadForm.Field>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lead-priority">Priority</Label>
                <leadForm.Field name="priority">
                  {(field) => (
                    <Select
                      value={field.state.value}
                      onValueChange={(priority) => field.handleChange(priority as LeadPriority)}
                    >
                      <SelectTrigger id="lead-priority" className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </leadForm.Field>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lead-notes">Internal notes</Label>
                <leadForm.Field name="internalNotes">
                  {(field) => (
                    <Textarea
                      id="lead-notes"
                      name={field.name}
                      className="min-h-28 resize-y"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                  )}
                </leadForm.Field>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <leadForm.Field name="archived">
                  {(field) => (
                    <Checkbox
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked === true)}
                    />
                  )}
                </leadForm.Field>
                Archive this lead
              </label>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedLead(null)}>
                  Cancel
                </Button>
                <leadForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit || saving}>
                      {isSubmitting || saving ? "Saving..." : "Save lead"}
                    </Button>
                  )}
                />
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(leadToDelete)} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lead</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {leadToDelete?.email}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={saving}
              onClick={() => {
                if (leadToDelete) {
                  void deleteLeadMutation.mutateAsync(leadToDelete).then(() => setLeadToDelete(null));
                }
              }}
            >
              {saving ? "Deleting..." : "Delete lead"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
