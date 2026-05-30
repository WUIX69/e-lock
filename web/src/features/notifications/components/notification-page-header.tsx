"use client"

import { Check, CheckCheck, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NotificationPageHeaderProps {
  onMarkAllRead: () => void
  isAllRead: boolean
  onRefresh?: () => void
  refreshing?: boolean
}

export const NotificationPageHeader = ({
  onMarkAllRead,
  isAllRead,
  onRefresh,
  refreshing = false,
}: NotificationPageHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="h-8 w-1 rounded-full bg-primary" />
        <div>
          <h2 className="text-sm font-black tracking-[0.3em] text-muted-foreground uppercase">
            System Communications
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage security alerts, operational tasks, and health logs.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onMarkAllRead}
          disabled={isAllRead}
          size="sm"
          className="bg-muted text-foreground hover:bg-muted/80"
          aria-label="Mark all notifications as read"
        >
          {isAllRead ? (
            <>
              <CheckCheck className="size-4" />
              All Read
            </>
          ) : (
            <>
              <Check className="size-4" />
              Mark all as read
            </>
          )}
        </Button>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            disabled={refreshing}
            size="sm"
            className="bg-muted text-foreground hover:bg-muted/80 shrink-0 flex items-center gap-1.5"
            aria-label="Refresh notifications"
          >
            <RefreshCw
              className={cn("size-3.5", refreshing && "animate-spin")}
            />
            <span>Refresh</span>
          </Button>
        )}
      </div>
    </div>
  )
}
