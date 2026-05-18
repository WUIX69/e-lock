"use client"

import * as React from "react"
import { RefreshCcw, PlusCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const DevicesHeader = () => {
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [syncStatus, setSyncStatus] = React.useState<string | null>(null)

  const handleSyncDevices = () => {
    setIsSyncing(true)
    setSyncStatus(null)
    // HACK: Simulate handshake sync over ESP-NOW protocol nodes
    setTimeout(() => {
      setIsSyncing(false)
      setSyncStatus("All mesh nodes synchronized successfully!")
      setTimeout(() => setSyncStatus(null), 3000)
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              Lockout Devices
            </h2>
          </div>
          <p className="ml-4 text-sm text-muted-foreground">
            Manage hardware nodes and ESP-NOW mesh network status.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            disabled={isSyncing}
            onClick={handleSyncDevices}
            className="flex items-center gap-2 h-12 px-6 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors active:scale-95 bg-transparent shrink-0"
            aria-label="Sync mesh devices"
          >
            {isSyncing ? (
              <>
                <Loader2 className="size-5 animate-spin mr-2" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCcw className="size-5 mr-2" />
                Sync Device
              </>
            )}
          </Button>
          <Button
            className="flex items-center gap-2 h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
            aria-label="Register new hardware device"
          >
            <PlusCircle className="size-5 mr-2" />
            Register New Hardware
          </Button>
        </div>
      </div>

      {syncStatus && (
        <div className="text-sm font-semibold text-primary animate-fade-in pl-4">
          {syncStatus}
        </div>
      )}
    </div>
  )
}
