"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_AUDIT_LOGS } from "@/data/mock/audit-logs"
import type { AuditLog } from "@/types/audit"
import { DataTable } from "@/components/ui/data-table"

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
      return (
        <div className="text-right">
          <Badge
            className={cn(
              "rounded-full px-4 py-1 text-[10px] font-black tracking-widest uppercase shadow-sm",
              status === "Secured" && "bg-accent text-accent-foreground",
              status === "Active" && "bg-secondary text-secondary-foreground",
              status === "Blocked" && "bg-destructive text-destructive-foreground"
            )}
          >
            {status}
          </Badge>
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
    <DataTable
      columns={columns}
      data={filtered}
      pageSize={8}
      toolbar={
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search personnel or machine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-64 text-xs"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 w-36 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground"
          >
            <option value="all">All Statuses</option>
            <option value="Secured">Secured</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      }
    />
  )
}
