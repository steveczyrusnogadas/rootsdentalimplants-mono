import type { ComponentProps } from "react";
import type { Row, Table as ReactTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

type AdminDataTableProps<TData> = {
  table: ReactTable<TData>;
  emptyMessage: string;
  isLoading?: boolean;
  getRowProps?: (row: Row<TData>) => ComponentProps<"tr">;
};

export function AdminDataTable<TData>({
  table,
  emptyMessage,
  isLoading = false,
  getRowProps,
}: AdminDataTableProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} {...getRowProps?.(row)}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
        ))}
        {!isLoading && rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={table.getAllLeafColumns().length} className="py-8 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  );
}
