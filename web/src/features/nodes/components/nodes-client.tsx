"use client"

import { useState, useMemo } from "react"
import { NodeDevice } from "@/types/nodes"
import { NodesHeader } from "@/features/nodes/components/nodes-header"
import { NodeFilters } from "@/features/nodes/components/node-filters"
import { NodeGrid } from "@/features/nodes/components/node-grid"

interface NodesClientProps {
  nodes: NodeDevice[]
}

export const NodesClient = ({ nodes }: NodesClientProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "nearby">("all")

  const filteredNodes = useMemo(
    () =>
      nodes.filter((node) => {
        const matchesSearch =
          node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.sector.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
      }),
    [nodes, searchQuery]
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
