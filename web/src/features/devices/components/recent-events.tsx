"use client"

import * as React from "react"
import { MOCK_DEVICE_EVENTS } from "../data/mock-devices"

const eventDotStyles = {
  info: "bg-muted-foreground",
  warning: "bg-destructive",
  success: "bg-primary",
}

export function RecentEvents() {
  return (
    <div className="bg-sidebar text-sidebar-foreground rounded-[2rem] p-8 flex flex-col h-full">
      <h3 className="text-2xl font-bold mb-2">Recent Events</h3>
      <p className="text-muted-foreground/60 mb-8">Hardware-level logs</p>

      <div className="space-y-6 flex-1">
        {MOCK_DEVICE_EVENTS.map((event) => (
          <div key={event.id} className="flex gap-4">
            <div
              className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                eventDotStyles[event.type]
              }`}
            />
            <div>
              <p className="text-sm font-bold">{event.message}</p>
              <p className="text-xs text-muted-foreground/50">
                Timestamp: {event.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-3 border border-border/20 rounded-xl text-sm font-bold text-muted-foreground hover:bg-white/5 transition-colors">
        View All Logs
      </button>
    </div>
  )
}