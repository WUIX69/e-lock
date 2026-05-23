"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Wind, Droplets, Flame, Sliders } from "lucide-react"
import { MOCK_ENERGY_SOURCES, EnergySource } from "@/data/mock/energy"
import { DataTable } from "@/components/ui/data-table"
import { cn } from "@/lib/utils"

const typeIcons = {
  electrical: Zap,
  pneumatic: Wind,
  hydraulic: Droplets,
  chemical: Flame,
}

const statusStyles = {
  connected:
    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  isolated:
    "bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  warning:
    "bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
}

const columns: ColumnDef<EnergySource>[] = [
  {
    accessorKey: "name",
    header: "Source Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        <div className="text-sm font-bold text-foreground">{row.original.name}</div>
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
      <div className="text-right">
        <Badge
          variant="outline"
          className={cn(
            "text-xs font-bold tracking-wide uppercase",
            statusStyles[row.original.status]
          )}
        >
          {row.original.status}
        </Badge>
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
    <Card className="border border-border/50 bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Source Registry
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            List of primary isolation checkpoints
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Sliders className="h-4 w-4" />
          <span className="sr-only">Table Settings</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <DataTable
          columns={columns}
          data={filtered}
          pageSize={5}
          toolbar={
            <div className="flex flex-wrap gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-36 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
              >
                <option value="all">All Types</option>
                <option value="electrical">Electrical</option>
                <option value="pneumatic">Pneumatic</option>
                <option value="hydraulic">Hydraulic</option>
                <option value="chemical">Chemical</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-36 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
              >
                <option value="all">All Statuses</option>
                <option value="connected">Connected</option>
                <option value="isolated">Isolated</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          }
        />
      </CardContent>
    </Card>
  )
}
