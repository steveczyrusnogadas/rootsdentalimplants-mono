export const contactKeys = {
  all: ["contact"] as const,
  submissions: () => [...contactKeys.all, "submissions"] as const,
};

export const blogKeys = {
  all: ["blog"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (page: number, pageSize: number) => [...blogKeys.lists(), { page, pageSize }] as const,
  recent: (limit: number) => [...blogKeys.all, "recent", { limit }] as const,
  detail: (slug: string) => [...blogKeys.all, "detail", slug] as const,
};

export const locationKeys = {
  all: ["locations"] as const,
  published: () => [...locationKeys.all, "published"] as const,
};
