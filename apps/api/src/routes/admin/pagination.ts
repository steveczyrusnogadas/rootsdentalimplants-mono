const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PaginationParams = {
  page: number;
  pageSize: number;
};

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parsePaginationParams(page: string | undefined, limit: string | undefined): PaginationParams {
  return {
    page: parsePositiveInteger(page, 1),
    pageSize: Math.min(parsePositiveInteger(limit, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE),
  };
}

export function getPaginationMeta(total: number, params: PaginationParams): PaginationMeta {
  return {
    page: params.page,
    pageSize: params.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
  };
}

export function getPaginationOffset(params: PaginationParams) {
  return (params.page - 1) * params.pageSize;
}
