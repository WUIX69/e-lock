"use client"

import * as React from "react"
import { Network, Wifi, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NETWORK_STATS } from "@/data/mock/settings"

export const NetworkManagement = () => {
  const [isScanning, setIsScanning] = React.useState(false)
  const [signalStrength, setSignalStrength] = React.useState(
    NETWORK_STATS.signalStrength
  )
  const [signalStatus, setSignalStatus] = React.useState(
    NETWORK_STATS.signalStatus
  )

  const pairingPercentage =
    (NETWORK_STATS.nodePairing.used / NETWORK_STATS.nodePairing.total) * 100

  const handleScanNodes = () => {
    setIsScanning(true)
    // HACK: Simulate live mesh node discovery and signal handshake latency
    setTimeout(() => {
      setIsScanning(false)
      // Slightly fluctuate signal strength on refresh to show live data
      const randomOffset = Math.floor(Math.random() * 5) - 2 // -2 to +2 dBm fluctuation
      const newStrength = Math.min(
        -30,
        Math.max(-90, NETWORK_STATS.signalStrength + randomOffset)
      )
      setSignalStrength(newStrength)

      if (newStrength >= -50) {
        setSignalStatus("Excellent Link")
      } else if (newStrength >= -70) {
        setSignalStatus("Good Link")
      } else {
        setSignalStatus("Moderate Link")
      }
    }, 2000)
  }

  return (
    <Card className="relative overflow-hidden border border-border/50 bg-card text-card-foreground">
      <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-5 dark:opacity-10">
        <Wifi
          className={`text-[200px] text-muted-foreground transition-all duration-300 ${isScanning ? "animate-pulse" : ""}`}
        />
      </div>

      <div className="relative z-10">
        <CardHeader className="flex flex-row items-start justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-lg bg-secondary p-2">
              <Network className="size-5 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Network Management
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Active Mesh Protocol: ESP-NOW
              </p>
            </div>
          </div>
          <Button
            variant={isScanning ? "outline" : "secondary"}
            size="sm"
            onClick={handleScanNodes}
            disabled={isScanning}
            className="h-8 min-w-[112px] font-bold"
            aria-label="Scan mesh nodes"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 size-3.5 animate-spin" />
                SCANNING...
              </>
            ) : (
              "SCAN NODES"
            )}
          </Button>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/50 bg-muted/30 p-4 dark:bg-muted/10">
              <p className="mb-2 text-xs font-bold text-muted-foreground uppercase">
                Signal Strength
              </p>
              <div className="mb-2 flex items-end gap-1">
                <div
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${signalStrength >= -80 ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
                <div
                  className={`h-4 w-2 rounded-full transition-all duration-300 ${signalStrength >= -70 ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
                <div
                  className={`h-6 w-2 rounded-full transition-all duration-300 ${signalStrength >= -60 ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
                <div
                  className={`h-8 w-2 rounded-full transition-all duration-300 ${signalStrength >= -50 ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
                <span className="ml-2 text-2xl font-black text-foreground">
                  {signalStrength} dBm
                </span>
              </div>
              <p className="text-xs font-semibold text-primary">
                {signalStatus}
              </p>
            </div>

            <div className="rounded-xl border border-border/50 bg-muted/30 p-4 dark:bg-muted/10">
              <p className="mb-2 text-xs font-bold text-muted-foreground uppercase">
                Node Pairing
              </p>
              <p className="mb-2 text-2xl font-black text-foreground">
                {NETWORK_STATS.nodePairing.used} /{" "}
                {NETWORK_STATS.nodePairing.total}
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${pairingPercentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Capacity remaining
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
