"use client"

import { Plus } from "lucide-react"
import { NodeDevice } from "@/types/nodes"
import { NodeCard } from "./node-card"

interface NodeGridProps {
  nodes: NodeDevice[]
}

export const NodeGrid = ({ nodes }: NodeGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {nodes.map((node) => (
        <NodeCard key={node.id} node={node} />
      ))}

      <button className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border p-6 transition-all hover:bg-muted/50 active:scale-95 group">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
          <Plus className="size-8 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        <div className="text-center">
          <p className="font-bold text-muted-foreground transition-colors group-hover:text-primary">
            Provision New Node
          </p>
          <p className="mt-1 text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
            Hardware Deployment
          </p>
        </div>
      </button>
    </div>
  )
}
