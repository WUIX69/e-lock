"use client"

import { useState, useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable as SharedDataTable } from "@/components/ui/data-table"
import { ToolbarRow } from "@/components/primitives/toolbar-row"
import { FilterInput } from "@/components/primitives/filter-input"
import { FilterSelect } from "@/components/primitives/filter-select"
import { PersonnelRow } from "./columns"

interface DataTableProps {
  columns: ColumnDef<PersonnelRow>[]
  data: PersonnelRow[]
}

export function DataTable({
  columns,
  data,
}: DataTableProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = useMemo(() => {
    return data.filter((item: PersonnelRow) => {
      if (roleFilter !== "all" && item.role !== roleFilter) return false
      if (statusFilter !== "all" && item.status !== statusFilter) return false

      if (search) {
        const q = search.toLowerCase()
        const name = String(item.name || "").toLowerCase()
        const employeeId = String(item.employeeId || "").toLowerCase()
        const position = String(item.position || "").toLowerCase()

        if (
          !name.includes(q) &&
          !employeeId.includes(q) &&
          !position.includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [data, search, roleFilter, statusFilter])

  return (
    <div className="space-y-4">
      <ToolbarRow
        filters={
          <>
            <FilterInput
              placeholder="Search personnel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FilterSelect
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { value: "all", label: "All Roles" },
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
              ]}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "off-site", label: "Off-site" },
                { value: "on-leave", label: "On-leave" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </>
        }
        actions={
          <button
            type="button"
            onClick={() => {
              setSearch("")
              setRoleFilter("all")
              setStatusFilter("all")
            }}
            className="flex items-center gap-1 rounded-xl border border-border bg-card px-4 py-1.5 text-xs font-bold text-foreground transition-all hover:bg-muted active:scale-95"
          >
            <span className="text-sm">✕</span>
            Reset
          </button>
        }
      />
      <SharedDataTable columns={columns} data={filteredData} pageSize={6} />
    </div>
  )
}
