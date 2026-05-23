"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PaginationBar } from "@/components/ui/pagination-bar"
import { usePagination } from "@/hooks/use-pagination"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number
  onRowClick?: (row: TData) => void
  toolbar?: React.ReactNode
  emptyMessage?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  onRowClick,
  toolbar,
  emptyMessage = "No results found.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const pagination = usePagination({ totalItems: data.length, pageSize })
  const pageData = data.slice(pagination.startIndex, pagination.endIndex)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {toolbar && (
        <div className="border-b border-border/50 p-4">{toolbar}</div>
      )}
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-border hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sortDir = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-12 text-[10px] font-black tracking-widest text-muted-foreground uppercase select-none",
                      canSort && "cursor-pointer hover:text-foreground"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {canSort && (
                      <span className="ml-1.5 inline-block w-4 text-xs">
                        {sortDir === "asc" && " ▲"}
                        {sortDir === "desc" && " ▼"}
                        {!sortDir && " ⇅"}
                      </span>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {pageData.length ? (
            pageData.map((row, index) => {
              const tableRow = table.getRowModel().rows[index]
              if (!tableRow) return null
              return (
                <TableRow
                  key={tableRow.id}
                  data-state={tableRow.getIsSelected() && "selected"}
                  className={cn(
                    "border-border transition-colors hover:bg-muted/30",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(tableRow.original)}
                >
                  {tableRow.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaginationBar
        page={pagination.page}
        totalPages={pagination.totalPages}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={data.length}
        pageNumbers={pagination.pageNumbers}
        hasNext={pagination.hasNext}
        hasPrev={pagination.hasPrev}
        onNext={pagination.nextPage}
        onPrev={pagination.prevPage}
        onGoToPage={pagination.goToPage}
      />
    </div>
  )
}
