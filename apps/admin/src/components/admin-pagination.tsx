import type { PaginationMeta } from "@repo/types/admin/users";
import type { MouseEvent } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type AdminPaginationProps = {
  pagination: PaginationMeta;
  disabled?: boolean;
  onPageChange: (page: number) => void;
};

function handlePaginationClick(event: MouseEvent<HTMLAnchorElement>, disabled: boolean, action: () => void) {
  event.preventDefault();

  if (!disabled) {
    action();
  }
}

export function AdminPagination({ pagination, disabled = false, onPageChange }: AdminPaginationProps) {
  const previousDisabled = disabled || pagination.page <= 1;
  const nextDisabled = disabled || pagination.page >= pagination.totalPages;

  return (
    <div className="mt-4 flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
      <div>
        Showing page {pagination.page} of {pagination.totalPages}
      </div>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={previousDisabled}
              className={previousDisabled ? "pointer-events-none opacity-50" : undefined}
              onClick={(event) =>
                handlePaginationClick(event, previousDisabled, () => onPageChange(pagination.page - 1))
              }
            />
          </PaginationItem>
          <PaginationItem>
            <span className="flex h-9 items-center px-3">
              {pagination.page} / {pagination.totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={nextDisabled}
              className={nextDisabled ? "pointer-events-none opacity-50" : undefined}
              onClick={(event) => handlePaginationClick(event, nextDisabled, () => onPageChange(pagination.page + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
