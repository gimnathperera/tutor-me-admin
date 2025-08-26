import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalResults?: number;
  limit?: number;
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  page = 1,
  totalPages = 1,
  onPageChange,
  totalResults = 0,
  limit = 10,
}: DataTableProps<T>) {

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90">
        <p className="text-gray-500 dark:text-white/70">
          This is empty. Please create a new one.
        </p>
      </div>
    );
  }

  // Determine if pagination should be hidden based on total results
  const showPagination = totalResults > limit;
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  // Generate an array of page numbers to display
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] dark:text-white/90">
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-white/90"
                  >
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-white/90"
                    >
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Pagination Controls */}
      {showPagination && (
        <Pagination className="text-gray-500 dark:text-white/90 mb-3">
          <PaginationContent>
            <PaginationItem>
              {/* Fix: Check if it's the first page before calling onPageChange */}
              <PaginationPrevious onClick={() => !isFirstPage && onPageChange && onPageChange(page - 1)} />
            </PaginationItem>
            {pages.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink onClick={() => onPageChange && onPageChange(p)} isActive={p === page}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              {/* Fix: Check if it's the last page before calling onPageChange */}
              <PaginationNext onClick={() => !isLastPage && onPageChange && onPageChange(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
