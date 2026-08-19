export type SortDirection = "asc" | "desc";

type ParseListQueryOptions<TSortBy extends string> = {
  search: string | undefined;
  sortBy: string | undefined;
  sortDir: string | undefined;
  allowedSorts: readonly TSortBy[];
  defaultSortBy: TSortBy;
};

export type ListQueryParams<TSortBy extends string> = {
  search: string;
  sortBy: TSortBy;
  sortDir: SortDirection;
};

export function parseListQueryParams<TSortBy extends string>({
  search,
  sortBy,
  sortDir,
  allowedSorts,
  defaultSortBy,
}: ParseListQueryOptions<TSortBy>): ListQueryParams<TSortBy> {
  const trimmedSearch = search?.trim() ?? "";
  const parsedSortBy = allowedSorts.includes(sortBy as TSortBy) ? (sortBy as TSortBy) : defaultSortBy;
  const parsedSortDir = sortDir === "asc" ? "asc" : "desc";

  return {
    search: trimmedSearch,
    sortBy: parsedSortBy,
    sortDir: parsedSortDir,
  };
}
