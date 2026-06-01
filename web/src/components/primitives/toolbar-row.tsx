"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolbarRowProps {
  title?: string
  filters?: React.ReactNode
  actions?: React.ReactNode
  onRefresh?: () => void
  showRefresh?: boolean
}

export function ToolbarRow({
  title,
  filters,
  actions,
  onRefresh,
  showRefresh = true,
}: ToolbarRowProps) {
  const router = useRouter()
  const [refreshing, setRefreshing] = React.useState<boolean>(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    const start = Date.now()
    if (onRefresh) {
      await onRefresh()
    } else {
      router.refresh()
    }
    const elapsed = Date.now() - start
    if (elapsed < 600) {
      await new Promise((resolve) => setTimeout(resolve, 600 - elapsed))
    }
    setRefreshing(false)
  }

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
      {(actions || showRefresh) && (
        <div className="flex items-center gap-2">
          {showRefresh && (
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted active:scale-95 disabled:opacity-50",
                refreshing && "bg-muted"
              )}
              aria-label="Refresh data"
            >
              <RefreshCw
                className={cn("size-3.5", refreshing && "animate-spin")}
              />
              <span>Refresh</span>
            </button>
          )}
          {actions}
        </div>
      )}
    </div>
  )
}

