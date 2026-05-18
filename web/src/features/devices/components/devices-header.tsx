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

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            disabled={isSyncing}
            onClick={handleSyncDevices}
            className="flex h-12 shrink-0 items-center gap-2 rounded-xl border-2 border-primary bg-transparent px-6 font-bold text-primary transition-colors hover:bg-primary/5 active:scale-95"
            aria-label="Sync mesh devices"
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 size-5" />
                Sync Device
              </>
            )}
          </Button>
          <Button
            className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
            aria-label="Register new hardware device"
          >
            <PlusCircle className="mr-2 size-5" />
            Register New Hardware
          </Button>
        </div>
      </div>

      {syncStatus && (
        <div className="animate-fade-in pl-4 text-sm font-semibold text-primary">
          {syncStatus}
        </div>
      )}
    </div>
  )
}
