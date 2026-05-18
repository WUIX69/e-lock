"use client"

import * as React from "react"
import { Network, Wifi, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NETWORK_STATS } from "@/data/mock/settings"

export const NetworkManagement = () => {
  const [isScanning, setIsScanning] = React.useState(false)
  const [signalStrength, setSignalStrength] = React.useState(NETWORK_STATS.signalStrength)
  const [signalStatus, setSignalStatus] = React.useState(NETWORK_STATS.signalStatus)

  const pairingPercentage = (NETWORK_STATS.nodePairing.used / NETWORK_STATS.nodePairing.total) * 100

  const handleScanNodes = () => {
    setIsScanning(true)
    // HACK: Simulate live mesh node discovery and signal handshake latency
    setTimeout(() => {
      setIsScanning(false)
      // Slightly fluctuate signal strength on refresh to show live data
      const randomOffset = Math.floor(Math.random() * 5) - 2 // -2 to +2 dBm fluctuation
      const newStrength = Math.min(-30, Math.max(-90, NETWORK_STATS.signalStrength + randomOffset))
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
      <div className="absolute -right-10 -bottom-10 opacity-5 dark:opacity-10 pointer-events-none">
        <Wifi className={`text-[200px] text-muted-foreground transition-all duration-300 ${isScanning ? "animate-pulse" : ""}`} />
      </div>

      <div className="relative z-10">
        <CardHeader className="flex flex-row items-start justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-lg shrink-0">
              <Network className="size-5 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Network Management</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Active Mesh Protocol: ESP-NOW</p>
            </div>
          </div>
          <Button
            variant={isScanning ? "outline" : "secondary"}
            size="sm"
            onClick={handleScanNodes}
            disabled={isScanning}
            className="font-bold min-w-[112px] h-8"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-4 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-2">
                Signal Strength
              </p>
              <div className="flex items-end gap-1 mb-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${signalStrength >= -80 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                <div className={`w-2 h-4 rounded-full transition-all duration-300 ${signalStrength >= -70 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                <div className={`w-2 h-6 rounded-full transition-all duration-300 ${signalStrength >= -60 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                <div className={`w-2 h-8 rounded-full transition-all duration-300 ${signalStrength >= -50 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                <span className="ml-2 text-2xl font-black text-foreground">{signalStrength} dBm</span>
              </div>
              <p className="text-xs font-semibold text-primary">{signalStatus}</p>
            </div>

            <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-4 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-2">
                Node Pairing
              </p>
              <p className="text-2xl font-black text-foreground mb-2">
                {NETWORK_STATS.nodePairing.used} / {NETWORK_STATS.nodePairing.total}
              </p>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${pairingPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Capacity remaining</p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}