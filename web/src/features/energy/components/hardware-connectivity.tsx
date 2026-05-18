"use client"

import * as React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MOCK_HARDWARE_NODES } from "@/data/mock/energy"
import { Loader2, RefreshCw, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export const HardwareConnectivity = () => {
  const [isDiagnosing, setIsDiagnosing] = React.useState<boolean>(false)
  const [diagnosticResult, setDiagnosticResult] = React.useState<string | null>(
    null
  )

  const handleDiagnose = () => {
    setIsDiagnosing(true)
    setDiagnosticResult(null)

    setTimeout(() => {
      setIsDiagnosing(false)
      setDiagnosticResult("All nodes online. Node 31 latency stable (120ms).")
    }, 1500)
  }

  return (
    <Card className="border border-border/50 bg-card text-card-foreground shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 animate-pulse text-primary" />
          <div>
            <CardTitle className="text-lg font-bold tracking-tight">
              Hardware Connectivity
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              MESH signal diagnostics
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-4">
          {MOCK_HARDWARE_NODES.map((node) => {
            const isLowSignal = node.signalStrength < 50
            const isWarning = node.status === "warning"
            const isOnline = node.status === "online"

            return (
              <div
                key={node.id}
                className="flex items-center gap-3 rounded-lg border border-border/10 bg-muted/5 p-2.5"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  {isOnline && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={cn(
                      "relative inline-flex h-2.5 w-2.5 rounded-full",
                      isOnline
                        ? "bg-emerald-500"
                        : isWarning
                          ? "bg-amber-500"
                          : "bg-muted-foreground"
                    )}
                  />
                </span>

                <div className="min-w-0 flex-grow">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="truncate text-sm font-bold text-foreground">
                      {node.id}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold tracking-tight",
                        isLowSignal ? "text-amber-500" : "text-emerald-500"
                      )}
                    >
                      {node.signalStrength}% Sig
                    </span>
                  </div>

                  {/* Signal Strength Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full border border-border/10 bg-muted/60">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isLowSignal ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${node.signalStrength}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {diagnosticResult && (
          <div className="animate-in rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs font-medium text-emerald-600 transition-all duration-200 fade-in slide-in-from-top-1 dark:text-emerald-400">
            {diagnosticResult}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={handleDiagnose}
          variant="outline"
          disabled={isDiagnosing}
          className="w-full py-4 text-xs font-semibold tracking-wide uppercase transition-all duration-200 active:scale-95"
        >
          {isDiagnosing ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Diagnose Hardware
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
