"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Zap, Wind, Droplets, Flame, Circle } from "lucide-react"
import { MOCK_ENERGY_SOURCES, EnergySource } from "@/data/mock/energy"
import { DataTable } from "@/components/ui/data-table"
import { ToolbarRow } from "@/components/primitives/toolbar-row"
import { FilterSelect } from "@/components/primitives/filter-select"

const typeIcons = {
  electrical: Zap,
  pneumatic: Wind,
  hydraulic: Droplets,
  chemical: Flame,
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "connected":
      return "text-emerald-500 bg-emerald-500/10"
    case "isolated":
      return "text-blue-500 bg-blue-500/10"
    case "warning":
      return "text-amber-500 bg-amber-500/10"
    default:
      return "text-muted-foreground bg-muted"
  }
}

const columns: ColumnDef<EnergySource>[] = [
  {
    accessorKey: "name",
    header: "Source Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        <div className="text-sm font-bold text-foreground">
          {row.original.name}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground/80">
          ID: {row.original.id}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    enableSorting: true,
    cell: ({ row }) => {
      const type = row.original.type
      const Icon = typeIcons[type]
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground capitalize">
            {type}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        <div className="text-sm font-medium text-foreground">
          {row.original.location}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground/80">
          {row.original.gridZone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "hardwareNode",
    header: "Hardware",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="border border-border/30 text-xs font-medium"
      >
        {row.original.hardwareNode}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => (
      <div
        className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black tracking-widest uppercase ${getStatusColor(row.original.status)}`}
      >
        <Circle className="size-2 fill-current" />
        {row.original.status}
      </div>
    ),
  },
]

export const EnergyTable = () => {
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const filtered = MOCK_ENERGY_SOURCES.filter((s) => {
    if (typeFilter !== "all" && s.type !== typeFilter) return false
    if (statusFilter !== "all" && s.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-4">
      <ToolbarRow
        title="Source Registry"
        filters={
          <>
            <FilterSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: "all", label: "All Types" },
                { value: "electrical", label: "Electrical" },
                { value: "pneumatic", label: "Pneumatic" },
                { value: "hydraulic", label: "Hydraulic" },
                { value: "chemical", label: "Chemical" },
              ]}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "connected", label: "Connected" },
                { value: "isolated", label: "Isolated" },
                { value: "warning", label: "Warning" },
              ]}
            />
          </>
        }
      />
      <DataTable columns={columns} data={filtered} pageSize={5} />
    </div>
  )
}
