import { CheckCircle, Clock, Timer, Award } from "lucide-react"

interface UserTaskStatsProps {
  completedThisMonth: number
  pendingCount: number
  avgVerificationTime: number
  accuracyScore: number
}

export const UserTasksStats = ({
  completedThisMonth,
  pendingCount,
  avgVerificationTime,
  accuracyScore,
}: UserTaskStatsProps) => {
  const cards = [
    {
      icon: CheckCircle,
      iconBg: "bg-primary/10 text-primary",
      label: "THIS MONTH",
      value: String(completedThisMonth),
      sub: "Completed Tasks",
      fill: true,
    },
    {
      icon: Clock,
      iconBg:
        "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
      label: "CURRENT",
      value: String(pendingCount).padStart(2, "0"),
      sub: "Awaiting Approval",
    },
    {
      icon: Timer,
      iconBg: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
      label: "AVERAGE",
      value: avgVerificationTime > 0 ? `${avgVerificationTime}m` : "—",
      sub: "Verification Speed",
    },
    {
      icon: Award,
      iconBg: "bg-muted text-muted-foreground",
      label: "RATING",
      value: `${accuracyScore}%`,
      sub: "Accuracy Score",
    },
  ]

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.sub}
          className="flex h-32 flex-col justify-between rounded-2xl border border-border/50 bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-lg p-2 ${card.iconBg}`}>
              <card.icon
                className={`size-5 ${card.fill ? "fill-current" : ""}`}
              />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground/60 uppercase">
              {card.label}
            </span>
          </div>
          <div>
            <p className="text-3xl font-black tracking-tighter text-foreground">
              {card.value}
            </p>
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              {card.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
