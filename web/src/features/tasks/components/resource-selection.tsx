"use client"

import { MOCK_NODES } from "@/data/mock/nodes"
import { MOCK_TASK_TYPES } from "@/data/mock/tasks"

interface ResourceSelectionProps {
  nodeId: string
  taskType: string
  onNodeIdChange: (value: string) => void
  onTaskTypeChange: (value: string) => void
}

export const ResourceSelection = ({
  nodeId,
  taskType,
  onNodeIdChange,
  onTaskTypeChange,
}: ResourceSelectionProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <label className="block px-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Machine / Node ID
        </label>
        <select
          value={nodeId}
          onChange={(e) => onNodeIdChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-muted p-3 font-body-md text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="">Select a Node...</option>
          {MOCK_NODES.map((node) => (
            <option key={node.id} value={node.id}>
              {node.name} - {node.sector}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="block px-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Task Type
        </label>
        <select
          value={taskType}
          onChange={(e) => onTaskTypeChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-muted p-3 font-body-md text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="">Select Category...</option>
          {MOCK_TASK_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
