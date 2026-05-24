"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import {
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Circle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_AUDIT_LOGS } from "@/data/mock/audit-logs"
import type { AuditLog } from "@/types/audit"
import { DataTable } from "@/components/ui/data-table"
import { ToolbarRow } from "@/components/primitives/toolbar-row"
import { FilterInput } from "@/components/primitives/filter-input"
import { FilterSelect } from "@/components/primitives/filter-select"

const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "person.name",
    header: "Personnel",
    enableSorting: true,
    cell: ({ row }) => {
      const person = row.original.person
      return (
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-full text-xs font-black shadow-sm ring-4 ring-background",
              person.error
                ? "bg-destructive text-destructive-foreground"
                : "bg-muted text-primary"
            )}
          >
            {person.initials}
          </div>
          <div className="flex flex-col">
            <span
              className={cn(
                "text-sm font-bold",
                person.error ? "text-destructive" : "text-foreground"
              )}
            >
              {person.name}
            </span>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              {person.role}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "machineId",
    header: "Machine ID",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="rounded-lg border-border bg-muted px-3 py-1 text-[10px] font-black tracking-widest"
      >
        {row.original.machineId}
      </Badge>
    ),
  },
  {
    accessorKey: "isolation",
    header: "Isolation Type",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
        <Zap className="size-3.5" />
        {row.original.isolation}
      </div>
    ),
  },
  {
    accessorKey: "verification",
    header: "Verification",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
        {row.original.verification === "Biometric" ? (
          <Fingerprint className="size-4 text-primary" />
        ) : row.original.status === "Blocked" ? (
          <ShieldAlert className="size-4 text-destructive" />
        ) : (
          <ShieldCheck className="size-4 text-muted-foreground" />
        )}
        {row.original.verification}
      </div>
    ),
  },
  {
    accessorKey: "time",
    header: "Timestamp",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium text-muted-foreground">
        {row.original.time}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status
      const getColor = (s: string) => {
        switch (s) {
          case "Secured": return "text-accent-foreground bg-accent"
          case "Active": return "text-secondary-foreground bg-secondary"
          case "Blocked": return "text-destructive-foreground bg-destructive"
          default: return "text-muted-foreground bg-muted"
        }
      }
      return (
        <div
          className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black tracking-widest uppercase ${getColor(status)}`}
        >
          <Circle className="size-2 fill-current" />
          {status}
        </div>
      )
    },
  },
]

export function AuditTable() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const filtered = MOCK_AUDIT_LOGS.filter((log) => {
    if (statusFilter !== "all" && log.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !log.person.name.toLowerCase().includes(q) &&
        !log.machineId.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      <ToolbarRow
        filters={
          <>
            <FilterInput
              placeholder="Search personnel or machine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "Secured", label: "Secured" },
                { value: "Active", label: "Active" },
                { value: "Blocked", label: "Blocked" },
              ]}
            />
          </>
        }
      />
      <DataTable columns={columns} data={filtered} pageSize={8} />
    </div>
  )
}
