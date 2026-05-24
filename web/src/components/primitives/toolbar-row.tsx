"use client"

import * as React from "react"

interface ToolbarRowProps {
  title?: string
  filters?: React.ReactNode
  actions?: React.ReactNode
}

export function ToolbarRow({ title, filters, actions }: ToolbarRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {title && (
          <h3 className="pr-4 text-2xl font-black tracking-tighter text-foreground">
            {title}
          </h3>
        )}
        {filters}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
