"use client"

import {
  ClipboardList,
  Wrench,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"

interface TaskStatsBentoProps {
  totalSubmissions: number
  criticalRepairs: number
  pendingVerifications: number
  verificationRate: number
  growth: number
}

export const TaskStatsBento = ({
  totalSubmissions,
  criticalRepairs,
  pendingVerifications,
  verificationRate,
  growth,
}: TaskStatsBentoProps) => {
  const cards = [
    {
      icon: ClipboardList,
      iconBg: "bg-primary/10 text-primary",
      label: "Total Submissions",
      value: totalSubmissions.toLocaleString(),
      badge: `+${growth}% vs last month`,
      badgeColor: "text-primary font-bold",
      decoration: "text-primary",
    },
    {
      icon: Wrench,
      iconBg:
        "bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
      label: "Critical Repairs",
      value: String(criticalRepairs),
      badge: "Requires Attention",
      badgeColor: "text-rose-700 dark:text-rose-400 font-bold",
      decoration: "text-rose-300 dark:text-rose-700",
      bg: "bg-rose-50 dark:bg-rose-950/20",
    },
    {
      icon: ShieldCheck,
      iconBg:
        "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
      label: "Pending Verifications",
      value: String(pendingVerifications),
      badge: `${verificationRate}% Verification Rate`,
      badgeColor: "text-yellow-700 dark:text-yellow-400 font-bold",
      decoration: "text-yellow-300 dark:text-yellow-700",
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    {
      icon: TrendingUp,
      iconBg:
        "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
      label: "Completion Rate",
      value: `${verificationRate}%`,
      badge: `${growth > 0 ? "+" : ""}${growth}% MoM`,
      badgeColor: "text-emerald-700 dark:text-emerald-400 font-bold",
      decoration: "text-emerald-300 dark:text-emerald-700",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
  ]

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-3xl p-6 shadow-sm ${
              card.bg || "bg-card"
            } border border-border/30`}
          >
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl p-2 ${card.iconBg}`}>
                  <Icon className="size-5" />
                </div>
                <span className={card.badgeColor}>{card.badge}</span>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  {card.label}
                </p>
                <p className="text-3xl font-black tracking-tighter text-foreground">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
