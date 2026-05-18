"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_DEVICE_EVENTS, type DeviceEvent } from "../data/mock-devices"
import { Info, AlertTriangle, CheckCircle2, Loader2, ScrollText } from "lucide-react"
import { cn } from "@/lib/utils"

const eventDotStyles = {
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
}

const eventIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
}

// Extra mock events to show when user clicks "View All Logs"
const ADDITIONAL_MOCK_EVENTS: DeviceEvent[] = [
  {
    id: "evt-005",
    timestamp: "11:15:00",
    message: "Secondary Conveyor Shunt Trip Self-Test Passed",
    type: "success",
  },
  {
    id: "evt-006",
    timestamp: "10:42:18",
    message: "MESH Router NODE-114 Connected to Gateway Hub A",
    type: "info",
  },
  {
    id: "evt-007",
    timestamp: "09:05:44",
    message: "Gateway GTWY-01 Backup Battery Status: 85% Health",
    type: "info",
  },
]

export const RecentEvents = () => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [events, setEvents] = React.useState<DeviceEvent[]>(MOCK_DEVICE_EVENTS)

  const handleToggleLogs = () => {
    if (isExpanded) {
      setEvents(MOCK_DEVICE_EVENTS)
      setIsExpanded(false)
    } else {
      setIsLoading(true)
      // Simulate network request to fetch older logs
      setTimeout(() => {
        setEvents([...MOCK_DEVICE_EVENTS, ...ADDITIONAL_MOCK_EVENTS])
        setIsExpanded(true)
        setIsLoading(false)
      }, 800)
    }
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden border border-border/50 shadow-sm bg-card text-card-foreground">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Recent Events</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Hardware-level system logs
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4 pr-2">
        <div className="space-y-4">
          {events.map((event) => {
            const Icon = eventIcons[event.type]
            return (
              <div
                key={event.id}
                className="group flex gap-4 p-3 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/50 transition-all duration-200"
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border shrink-0 transition-transform group-hover:scale-105",
                    eventDotStyles[event.type]
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-none text-foreground break-words mb-1">
                    {event.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                      {event.type}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground/75">
                      Timestamp: {event.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/40">
        <Button
          onClick={handleToggleLogs}
          variant="outline"
          disabled={isLoading}
          className="w-full font-semibold transition-all duration-200 active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Fetching logs...
            </>
          ) : isExpanded ? (
            "Collapse Logs"
          ) : (
            "View All Logs"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}