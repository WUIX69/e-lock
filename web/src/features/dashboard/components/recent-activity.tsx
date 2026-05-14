import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: "1",
      user: "John Doe",
      action: "Access Granted",
      target: "Main Server Room",
      time: "2 minutes ago",
      initials: "JD",
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "Access Denied",
      target: "Executive Office",
      time: "15 minutes ago",
      initials: "JS",
      isAlert: true,
    },
    {
      id: "3",
      user: "Mike Johnson",
      action: "Lock Restarted",
      target: "Warehouse Entry B",
      time: "1 hour ago",
      initials: "MJ",
    },
    {
      id: "4",
      user: "System",
      action: "Firmware Updated",
      target: "All 1st Floor Locks",
      time: "3 hours ago",
      initials: "SY",
    },
    {
      id: "5",
      user: "Sarah Williams",
      action: "Access Granted",
      target: "Server Room B",
      time: "5 hours ago",
      initials: "SW",
    },
  ]

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
