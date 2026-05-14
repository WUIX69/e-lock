import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MOCK_RECENT_ACTIVITY } from "@/data/mock/dashboard"

export function RecentActivity() {
  const activities = MOCK_RECENT_ACTIVITY

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback
              className={
                activity.isAlert ? "bg-destructive/20 text-destructive" : ""
              }
            >
              {activity.initials}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm leading-none font-medium">{activity.user}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action} -{" "}
              <span className="font-medium text-foreground">
                {activity.target}
              </span>
            </p>
          </div>
          <div className="ml-auto text-sm font-medium text-muted-foreground">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  )
}
