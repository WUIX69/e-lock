"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import {
  SignalLow,
  SignalMedium,
  SignalHigh,
  Wifi,
  MoreHorizontal,
  Eye,
  Pencil,
  MoreVertical,
} from "lucide-react"
import { Device } from "@/types/devices"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { ToolbarRow } from "@/components/primitives/toolbar-row"
import { FilterInput } from "@/components/primitives/filter-input"
import { FilterSelect } from "@/components/primitives/filter-select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeviceDetailModal } from "@/features/devices/components/device-detail-modal"

interface SignalIconProps {
  strength: number
}

const SignalIcon = ({ strength }: SignalIconProps) => {
  if (strength === 0)
    return <Wifi className="size-4 animate-pulse text-primary" />
  if (strength > -60) return <SignalHigh className="size-4 text-primary" />
  if (strength > -80) return <SignalMedium className="size-4 text-secondary" />
  return <SignalLow className="size-4 text-destructive" />
}

interface DeviceTableProps {
  devices: Device[]
  onRefresh?: () => void
}

export const DeviceTable = ({ devices, onRefresh }: DeviceTableProps) => {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [viewDevice, setViewDevice] = React.useState<Device | null>(null)
  const [deviceModalMode, setDeviceModalMode] = React.useState<"view" | "edit">("view")

  const filtered = devices.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false
    if (typeFilter !== "all" && d.type !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !d.deviceId.toLowerCase().includes(q) &&
        !d.deviceUniqueName.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  const columns: ColumnDef<Device>[] = [
    {
      accessorKey: "deviceId",
      header: "Device ID",
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <div className="flex items-center gap-3">
            <div
              className={`h-2 w-2 rounded-full ${
                status === "active"
                  ? "animate-pulse bg-primary"
                  : status === "warning"
                    ? "bg-destructive"
                    : "bg-muted-foreground"
              }`}
            />
            <span className="rounded-md border border-border/35 bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
              {row.original.deviceId}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-semibold text-foreground capitalize">
          {row.original.type.replace("_", " ")}
        </span>
      ),
    },
    {
      accessorKey: "deviceUniqueName",
      header: "Device Name",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.deviceUniqueName}
        </span>
      ),
    },
    {
      accessorKey: "signalStrength",
      header: "Signal Strength",
      enableSorting: true,
      cell: ({ row }) => {
        const strength = row.original.signalStrength
        const status = row.original.status
        return (
          <div className="flex items-center gap-2">
            <SignalIcon strength={strength} />
            <span
              className={`text-xs font-bold ${
                status === "warning" ? "text-destructive" : "text-foreground"
              }`}
            >
              {strength === 0
                ? "Uplink Stable"
                : `${strength} dBm${strength < -80 ? " (LOW)" : ""}`}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "lastHeartbeat",
      header: "Last Heartbeat",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.lastHeartbeat}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-primary"
                aria-label="Device actions"
              >
                <MoreVertical className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() => {
                  setViewDevice(row.original)
                  setDeviceModalMode("view")
                }}
              >
                <Eye className="mr-2 size-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setViewDevice(row.original)
                  setDeviceModalMode("edit")
                }}
              >
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <ToolbarRow
        title="Hardware Fleet"
        onRefresh={onRefresh}
        filters={
          <>
            <FilterInput
              placeholder="Search device ID or machine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "warning", label: "Warning" },
                { value: "offline", label: "Offline" },
                { value: "maintenance", label: "Maintenance" },
              ]}
            />
            <FilterSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: "all", label: "All Types" },
                { value: "field_controller", label: "Field Controller" },
                { value: "shunt_trip", label: "Shunt Trip" },
                { value: "gateway", label: "Gateway" },
              ]}
            />
          </>
        }
        actions={
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg"
            aria-label="More fleet actions"
          >
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </Button>
        }
      />
      <DataTable columns={columns} data={filtered} pageSize={6} />

      {viewDevice && (
        <DeviceDetailModal
          open={!!viewDevice}
          onOpenChange={(open) => {
            if (!open) setViewDevice(null)
          }}
          device={viewDevice}
          mode={deviceModalMode}
          onModeChange={setDeviceModalMode}
          onDeviceUpdated={() => setViewDevice(null)}
        />
      )}
    </div>
  )
}
