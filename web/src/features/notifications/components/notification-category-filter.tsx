"use client"

import { Inbox, ShieldAlert, CheckCircle2, HeartPulse } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NotificationCategory } from "@/types/notifications"

interface CategoryDefinition {
  category: NotificationCategory
  label: string
  icon: typeof Inbox
  count: number
  description: string
}

interface NotificationCategoryFilterProps {
  activeCategory: NotificationCategory
  onSelectCategory: (category: NotificationCategory) => void
  counts: Record<NotificationCategory, number>
}

export const NotificationCategoryFilter = ({
  activeCategory,
  onSelectCategory,
  counts,
}: NotificationCategoryFilterProps) => {
  const categories: CategoryDefinition[] = [
    {
      category: "all",
      label: "All",
      icon: Inbox,
      count: counts.all,
      description: "All notifications",
    },
    {
      category: "safety_alert",
      label: "Safety Alerts",
      icon: ShieldAlert,
      count: counts.safety_alert,
      description: "Critical safety alerts",
    },
    {
      category: "task_update",
      label: "Task Updates",
      icon: CheckCircle2,
      count: counts.task_update,
      description: "Operational task updates",
    },
    {
      category: "system_health",
      label: "System Health",
      icon: HeartPulse,
      count: counts.system_health,
      description: "System health information",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {categories.map((categoryItem) => {
        const isActive = activeCategory === categoryItem.category
        const Icon = categoryItem.icon

        return (
          <button
            key={categoryItem.category}
            onClick={() => onSelectCategory(categoryItem.category)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelectCategory(categoryItem.category)
              }
            }}
            aria-label={`Filter by ${categoryItem.label}`}
            className={cn(
              "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border/50 bg-card text-foreground hover:border-border hover:bg-muted/50"
            )}
          >
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-sm font-bold",
                  isActive ? "text-primary-foreground" : "text-foreground"
                )}
              >
                {categoryItem.label}
              </p>
              <p
                className={cn(
                  "text-xs font-medium",
                  isActive
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {categoryItem.count} {categoryItem.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
