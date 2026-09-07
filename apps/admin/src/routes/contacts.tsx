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
import { useEffect, useMemo, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { AdminDataTable } from "@/components/admin-data-table";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminSortableHeader } from "@/components/admin-sortable-header";
import { AdminTableSearch } from "@/components/admin-table-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { adminApi } from "@/lib/api";
import {
  formatContactDate,
  formatContactSource,
  type AdminContact,
  type ContactResponse,
  type ContactsResponse,
} from "@/lib/admin-contacts";
import { adminAndManagerRoles, hasRoleAccess } from "@/lib/admin-roles";
import { authClient } from "@/lib/auth-client";
import { adminActivityKeys, adminContactKeys } from "@/lib/query-keys";

const PAGE_SIZE = 10;

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  kind: string;
  notes: string;
  tags: string;
};

const emptyContactForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  kind: "contact",
  notes: "",
  tags: "",
};

export const Route = createFileRoute("/contacts")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    const role = session?.user.role;

    if (!hasRoleAccess(role, adminAndManagerRoles)) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: ContactsPage,
});

function ContactsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isContactDetailRoute = useRouterState({
    select: (state) => state.location.pathname.startsWith("/contacts/"),
  });
  const [dialogOpen, setDialogOpen] = useState(false);
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
  const contactsQuery = useQuery({
    queryKey: adminContactKeys.list(paginationState.pageIndex + 1, paginationState.pageSize, search, sortBy, sortDir),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(paginationState.pageIndex + 1),
        limit: String(paginationState.pageSize),
        search,
        sortBy,
        sortDir,
      });

      return adminApi<ContactsResponse>(`/api/admin/contacts?${params.toString()}`, {
        errorMessage: "Failed to load contacts.",
      });
    },
    placeholderData: keepPreviousData,
  });
  const contacts = contactsQuery.data?.contacts ?? [];
  const pagination = contactsQuery.data?.pagination;
  const createContactMutation = useMutation({
    mutationFn: async (value: ContactFormState) => {
      const data = await adminApi<ContactResponse>("/api/admin/contacts", {
        method: "POST",
        body: JSON.stringify({
          name: value.name,
          email: value.email,
          phone: value.phone,
          kind: value.kind,
          notes: value.notes,
          tags: value.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
        errorMessage: "Failed to create contact.",
      });

      return data.contact;
    },
    onSuccess: () => {
      setPaginationState((current) => ({ ...current, pageIndex: 0 }));
      void queryClient.invalidateQueries({ queryKey: adminContactKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: adminActivityKeys.lists() });
    },
  });
  const contactForm = useForm({
    defaultValues: emptyContactForm,
    onSubmit: async ({ value }) => {
      await createContactMutation.mutateAsync(value);
      contactForm.reset(emptyContactForm);
      setDialogOpen(false);
    },
  });

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

  const columns = useMemo<ColumnDef<AdminContact>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <AdminSortableHeader column={column}>Contact</AdminSortableHeader>,
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
            {row.original.phone ? <div className="text-xs text-muted-foreground">{row.original.phone}</div> : null}
          </div>
        ),
      },
      {
        accessorKey: "kind",
        header: ({ column }) => <AdminSortableHeader column={column}>Type</AdminSortableHeader>,
        cell: ({ row }) => <Badge variant="secondary">{row.original.kind}</Badge>,
      },
      {
        accessorKey: "source",
        header: ({ column }) => <AdminSortableHeader column={column}>Source</AdminSortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{formatContactSource(row.original.source)}</span>,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <AdminSortableHeader column={column}>Created</AdminSortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{formatContactDate(row.original.createdAt)}</span>,
      },
    ],
    [],
  );
  const table = useReactTable({
    data: contacts,
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

  if (isContactDetailRoute) {
    return <Outlet />;
  }

  const error =
    (createContactMutation.error instanceof Error ? createContactMutation.error.message : "") ||
    (contactsQuery.error instanceof Error ? contactsQuery.error.message : "");

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="mt-1 text-muted-foreground">Review people created from converted leads or added manually.</p>
        </div>
        <Button
          onClick={() => {
            contactForm.reset(emptyContactForm);
            setDialogOpen(true);
          }}
        >
          <PlusIcon />
          New contact
        </Button>
      </div>

      {error ? <div className="mb-4 border border-destructive/40 p-3 text-sm text-destructive">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>All contacts</CardTitle>
          <CardDescription>
            {contactsQuery.isPending ? "Loading contacts..." : `${pagination?.total ?? 0} contacts`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdminTableSearch
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search contacts by name, email, phone, type, or source..."
          />
          <AdminDataTable
            table={table}
            emptyMessage="No contacts found."
            isLoading={contactsQuery.isPending}
            getRowProps={(row) => ({
              role: "link",
              tabIndex: 0,
              className: "cursor-pointer transition-colors hover:bg-muted/50 focus-visible:bg-muted/50",
              onClick: () =>
                void navigate({
                  to: "/contacts/$contactId",
                  params: { contactId: row.original.id },
                }),
              onKeyDown: (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  void navigate({
                    to: "/contacts/$contactId",
                    params: { contactId: row.original.id },
                  });
                }
              },
            })}
          />
          {pagination ? (
            <AdminPagination
              pagination={pagination}
              disabled={contactsQuery.isFetching}
              onPageChange={(page) => setPaginationState((current) => ({ ...current, pageIndex: page - 1 }))}
            />
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New contact</DialogTitle>
            <DialogDescription>Add a contact manually without converting a lead.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void contactForm.handleSubmit();
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="contact-name">Name</Label>
              <contactForm.Field name="name">
                {(field) => (
                  <Input
                    id="contact-name"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    required
                  />
                )}
              </contactForm.Field>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact-email">Email</Label>
              <contactForm.Field name="email">
                {(field) => (
                  <Input
                    id="contact-email"
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    required
                  />
                )}
              </contactForm.Field>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact-phone">Phone</Label>
              <contactForm.Field name="phone">
                {(field) => (
                  <Input
                    id="contact-phone"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                )}
              </contactForm.Field>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact-kind">Type</Label>
              <contactForm.Field name="kind">
                {(field) => (
                  <Input
                    id="contact-kind"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    required
                  />
                )}
              </contactForm.Field>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact-tags">Tags</Label>
              <contactForm.Field name="tags">
                {(field) => (
                  <Input
                    id="contact-tags"
                    name={field.name}
                    placeholder="customer, vip"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                )}
              </contactForm.Field>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact-notes">Notes</Label>
              <contactForm.Field name="notes">
                {(field) => (
                  <Textarea
                    id="contact-notes"
                    name={field.name}
                    className="min-h-28 resize-y"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                )}
              </contactForm.Field>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <contactForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || createContactMutation.isPending}>
                    {isSubmitting || createContactMutation.isPending ? "Creating..." : "Create contact"}
                  </Button>
                )}
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
