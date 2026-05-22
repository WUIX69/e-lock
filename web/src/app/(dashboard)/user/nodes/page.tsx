"use client"

import { useState, useMemo } from "react"
import { MOCK_NODES } from "@/data/mock/nodes"
import { NodesHeader } from "@/features/nodes/components/nodes-header"
import { NodeFilters } from "@/features/nodes/components/node-filters"
import { NodeGrid } from "@/features/nodes/components/node-grid"

export default function NodesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "nearby">("all")

  const filteredNodes = useMemo(
    () =>
      MOCK_NODES.filter((node) => {
        const matchesSearch =
          node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.sector.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
      }),
    [searchQuery]
  )

  return (
    <div className="space-y-8 pb-12">
      <NodesHeader />

      <NodeFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <NodeGrid nodes={filteredNodes} />
    </div>
  )
}
