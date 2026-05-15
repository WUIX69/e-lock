"use client"

import * as React from "react"
import { Siren } from "lucide-react"

export function EmergencyFab() {
  const handleClick = () => {
    // HACK: placeholder for emergency trigger
    console.log("EMERGENCY STOP TRIGGERED")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="fixed right-8 bottom-8 z-50 flex size-20 items-center justify-center rounded-full border-4 border-background bg-destructive text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
      title="IMMEDIATE HELP"
      aria-label="Request Immediate Help"
      tabIndex={0}
    >
      <Siren className="size-10" fill="currentColor" />
      <span className="sr-only">Emergency Help</span>
    </button>
  )
}
