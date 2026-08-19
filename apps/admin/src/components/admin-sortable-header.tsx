import type { Column } from "@tanstack/react-table";
import { Button } from "@repo/ui/components/button";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";

type AdminSortableHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  children: string;
};

export function AdminSortableHeader<TData, TValue>({ column, children }: AdminSortableHeaderProps<TData, TValue>) {
  const sorted = column.getIsSorted();
  const SortIcon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 px-2"
      onClick={column.getToggleSortingHandler()}
    >
      {children}
      <SortIcon className="ml-1 size-3.5" />
    </Button>
  );
}
