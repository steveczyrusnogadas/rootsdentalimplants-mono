export const adminProfileKeys = {
  all: ["admin", "profile"] as const,
  detail: () => [...adminProfileKeys.all, "detail"] as const,
};

export const settingsKeys = {
  all: ["admin", "settings"] as const,
  detail: () => [...settingsKeys.all, "detail"] as const,
  readiness: () => [...settingsKeys.all, "readiness"] as const,
};

export const authKeys = {
  all: ["auth"] as const,
  signIn: () => [...authKeys.all, "sign-in"] as const,
};

export const adminLeadKeys = {
  all: ["admin", "leads"] as const,
  lists: () => [...adminLeadKeys.all, "list"] as const,
  list: (view: string, page: number, pageSize: number, search: string, sortBy: string, sortDir: string) =>
    [...adminLeadKeys.lists(), { view, page, pageSize, search, sortBy, sortDir }] as const,
  detail: (id: string) => [...adminLeadKeys.all, "detail", id] as const,
};

export const adminContactKeys = {
  all: ["admin", "contacts"] as const,
  lists: () => [...adminContactKeys.all, "list"] as const,
  list: (page: number, pageSize: number, search: string, sortBy: string, sortDir: string) =>
    [...adminContactKeys.lists(), { page, pageSize, search, sortBy, sortDir }] as const,
  detail: (id: string) => [...adminContactKeys.all, "detail", id] as const,
};

export const adminBlogKeys = {
  all: ["admin", "blog"] as const,
  lists: () => [...adminBlogKeys.all, "list"] as const,
  list: (status: string, page: number, pageSize: number, search: string, sortBy: string, sortDir: string) =>
    [...adminBlogKeys.lists(), { status, page, pageSize, search, sortBy, sortDir }] as const,
  detail: (id: string) => [...adminBlogKeys.all, "detail", id] as const,
};

export const adminMediaKeys = {
  all: ["admin", "media"] as const,
  lists: () => [...adminMediaKeys.all, "list"] as const,
  list: (page: number, pageSize: number, search: string, sortBy: string, sortDir: string, assetType = "") =>
    [...adminMediaKeys.lists(), { page, pageSize, search, sortBy, sortDir, assetType }] as const,
  detail: (id: string) => [...adminMediaKeys.all, "detail", id] as const,
};

export const adminUserKeys = {
  all: ["admin", "users"] as const,
  lists: () => [...adminUserKeys.all, "list"] as const,
  list: (page: number, pageSize: number, search: string, sortBy: string, sortDir: string) =>
    [...adminUserKeys.lists(), { page, pageSize, search, sortBy, sortDir }] as const,
  detail: (id: string) => [...adminUserKeys.all, "detail", id] as const,
};

export const adminActivityKeys = {
  all: ["admin", "activity"] as const,
  lists: () => [...adminActivityKeys.all, "list"] as const,
  list: (page: number, pageSize: number, search: string, sortBy: string, sortDir: string) =>
    [...adminActivityKeys.lists(), { page, pageSize, search, sortBy, sortDir }] as const,
};

export const adminLocationKeys = {
  all: ["admin", "locations"] as const,
  lists: () => [...adminLocationKeys.all, "list"] as const,
  list: (published: string, page: number, pageSize: number, search: string, sortBy: string, sortDir: string) =>
    [...adminLocationKeys.lists(), { published, page, pageSize, search, sortBy, sortDir }] as const,
  detail: (id: string) => [...adminLocationKeys.all, "detail", id] as const,
};

export const adminNotificationKeys = {
  all: ["admin", "notifications"] as const,
  list: () => [...adminNotificationKeys.all, "list"] as const,
};

export const adminChatKeys = {
  all: ["admin", "chat"] as const,
  messages: () => [...adminChatKeys.all, "messages"] as const,
};

export const dashboardKeys = {
  all: ["admin", "dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};
