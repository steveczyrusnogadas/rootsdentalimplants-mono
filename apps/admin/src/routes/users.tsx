import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import type { AdminUser, UserResponse, UserRole, UsersResponse } from "@repo/types/admin/users";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
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
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { AdminDataTable } from "@/components/admin-data-table";
import { AdminPagination } from "@/components/admin-pagination";
import { AdminSortableHeader } from "@/components/admin-sortable-header";
import { AdminTableSearch } from "@/components/admin-table-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { adminApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { adminActivityKeys, adminUserKeys } from "@/lib/query-keys";

type UserFormState = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const emptyForm: UserFormState = {
  name: "",
  email: "",
  password: "",
  role: "manager",
};
const PAGE_SIZE = 10;
const userRoleLabels: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
};

export const Route = createFileRoute("/users")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    const role = session?.user.role;

    if (role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: UsersPage,
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function UsersPage() {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
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
  const usersQuery = useQuery({
    queryKey: adminUserKeys.list(paginationState.pageIndex + 1, paginationState.pageSize, search, sortBy, sortDir),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(paginationState.pageIndex + 1),
        limit: String(paginationState.pageSize),
        search,
        sortBy,
        sortDir,
      });

      return adminApi<UsersResponse>(`/api/admin/users?${params.toString()}`, {
        errorMessage: "Failed to load users.",
      });
    },
    placeholderData: keepPreviousData,
  });
  const users = usersQuery.data?.users ?? [];
  const pagination = usersQuery.data?.pagination;

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

  const saveUserMutation = useMutation({
    mutationFn: async (value: UserFormState) => {
      const data = await adminApi<UserResponse>(
        editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users",
        {
          method: editingUser ? "PATCH" : "POST",
          body: JSON.stringify(
            editingUser
              ? {
                  name: value.name,
                  email: value.email,
                  role: value.role,
                }
              : value,
          ),
          errorMessage: "Failed to save user.",
        },
      );

      return data.user;
    },
    onSuccess: () => {
      if (!editingUser) {
        setPaginationState((current) => ({ ...current, pageIndex: 0 }));
      }
      void queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: adminActivityKeys.lists() });
    },
  });
  const deleteUserMutation = useMutation({
    mutationFn: async (user: AdminUser) => {
      await adminApi<UserResponse>(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        errorMessage: "Failed to delete user.",
      });

      return user;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: adminActivityKeys.lists() });
    },
  });
  const userForm = useForm({
    defaultValues: emptyForm,
    onSubmit: async ({ value }) => {
      await saveUserMutation.mutateAsync(value);
      setDialogOpen(false);
    },
  });

  const setUserFormValues = useCallback((value: UserFormState) => {
    userForm.setFieldValue("name", value.name);
    userForm.setFieldValue("email", value.email);
    userForm.setFieldValue("password", value.password);
    userForm.setFieldValue("role", value.role);
  }, [userForm]);

  function openCreateDialog() {
    setEditingUser(null);
    userForm.reset(emptyForm);
    setUserFormValues(emptyForm);
    setDialogOpen(true);
  }

  const openEditDialog = useCallback((user: AdminUser) => {
    const formValue = {
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    };

    setEditingUser(user);
    userForm.reset(formValue);
    setUserFormValues(formValue);
    setDialogOpen(true);
  }, [setUserFormValues, userForm]);

  const loading = usersQuery.isPending;
  const saving = saveUserMutation.isPending || deleteUserMutation.isPending;
  const error =
    (saveUserMutation.error instanceof Error ? saveUserMutation.error.message : "") ||
    (deleteUserMutation.error instanceof Error ? deleteUserMutation.error.message : "") ||
    (usersQuery.error instanceof Error ? usersQuery.error.message : "");
  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <AdminSortableHeader column={column}>Name</AdminSortableHeader>,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => <AdminSortableHeader column={column}>Email</AdminSortableHeader>,
      },
      {
        accessorKey: "role",
        header: ({ column }) => <AdminSortableHeader column={column}>Role</AdminSortableHeader>,
        cell: ({ row }) => (
          <Badge variant={row.original.role === "admin" ? "default" : "secondary"}>
            {userRoleLabels[row.original.role]}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <AdminSortableHeader column={column}>Created</AdminSortableHeader>,
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => openEditDialog(row.original)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={saving || row.original.id === session?.user.id}
              onClick={() => setUserToDelete(row.original)}
            >
              <Trash2Icon />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [openEditDialog, saving, session?.user.id],
  );
  const table = useReactTable({
    data: users,
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

  return (
    <div className="p-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-muted-foreground">Manage administrator and standard user accounts.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusIcon />
          Add user
        </Button>
      </div>

      {error ? <div className="mb-4 border border-destructive/40 p-3 text-sm text-destructive">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>
            {loading ? "Loading users..." : `${pagination?.total ?? 0} users in the database`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdminTableSearch
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search users by name or email..."
          />
          <AdminDataTable table={table} emptyMessage="No users found." isLoading={loading} />
          {pagination ? (
            <AdminPagination
              pagination={pagination}
              disabled={usersQuery.isFetching}
              onPageChange={(page) => setPaginationState((current) => ({ ...current, pageIndex: page - 1 }))}
            />
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit user" : "Add user"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update the user's profile and role." : "Create a new email/password account."}
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void userForm.handleSubmit();
            }}
          >
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="user-name">
                Name
              </label>
              <userForm.Field
                name="name"
                validators={{
                  onChange: ({ value }) => (value.trim() ? undefined : "Name is required."),
                }}
              >
                {(field) => (
                  <>
                    <Input
                      id="user-name"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      required
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length ? (
                      <p className="text-sm text-destructive">{field.state.meta.errors.map(String).join(", ")}</p>
                    ) : null}
                  </>
                )}
              </userForm.Field>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="user-email">
                Email
              </label>
              <userForm.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value.trim()) {
                      return "Email is required.";
                    }

                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Enter a valid email address.";
                  },
                }}
              >
                {(field) => (
                  <>
                    <Input
                      id="user-email"
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      required
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length ? (
                      <p className="text-sm text-destructive">{field.state.meta.errors.map(String).join(", ")}</p>
                    ) : null}
                  </>
                )}
              </userForm.Field>
            </div>
            {!editingUser ? (
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="user-password">
                  Password
                </label>
                <userForm.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => (value.trim() ? undefined : "Password is required."),
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="user-password"
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        required
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length ? (
                        <p className="text-sm text-destructive">{field.state.meta.errors.map(String).join(", ")}</p>
                      ) : null}
                    </>
                  )}
                </userForm.Field>
              </div>
            ) : null}
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="user-role">
                Role
              </label>
              <userForm.Field name="role">
                {(field) => (
                  <Select value={field.state.value} onValueChange={(role) => field.handleChange(role as UserRole)}>
                    <SelectTrigger id="user-role" className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </userForm.Field>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <userForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || saving}>
                    {isSubmitting || saving ? "Saving..." : "Save user"}
                  </Button>
                )}
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(userToDelete)} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {userToDelete?.email}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={saving}
              onClick={() => {
                if (userToDelete) {
                  void deleteUserMutation.mutateAsync(userToDelete).then(() => setUserToDelete(null));
                }
              }}
            >
              {saving ? "Deleting..." : "Delete user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
