"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable as SharedDataTable } from "@/components/ui/data-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  return <SharedDataTable columns={columns} data={data} pageSize={6} />
}
