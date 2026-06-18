'use client';

import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUp, ArrowDown, ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SortConfig } from '@/types';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sort?: SortConfig;
  onSort?: (config: SortConfig) => void;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string }>({
  data, columns, sort, onSort, page = 1, pageSize = 20,
  totalCount = 0, onPageChange, loading, emptyMessage = 'Sin datos', onRowClick,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSort = (key: string) => {
    if (!onSort) return;
    onSort({
      field: key,
      direction: sort?.field === key && sort.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.map(col => (
                <TableHead
                  key={String(col.key)}
                  className={cn('font-semibold', col.className)}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                  style={col.sortable ? { cursor: 'pointer', userSelect: 'none' } : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      sort?.field === String(col.key) ? (
                        sort.direction === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
                      )
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map(col => (
                    <TableCell key={String(col.key)}>
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12 text-gray-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map(row => (
                <TableRow
                  key={row.id}
                  className={cn(onRowClick && 'cursor-pointer hover:bg-gray-50')}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(col => (
                    <TableCell key={String(col.key)} className={col.className}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[String(col.key)] ?? '-')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <p className="text-sm text-gray-500">
            {(page - 1)  *pageSize + 1}–{Math.min(page*  pageSize, totalCount)} de {totalCount}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8"
              onClick={() => onPageChange?.(1)} disabled={page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8"
              onClick={() => onPageChange?.(page - 1)} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">{page} / {totalPages}</span>
            <Button variant="outline" size="icon" className="h-8 w-8"
              onClick={() => onPageChange?.(page + 1)} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8"
              onClick={() => onPageChange?.(totalPages)} disabled={page === totalPages}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
