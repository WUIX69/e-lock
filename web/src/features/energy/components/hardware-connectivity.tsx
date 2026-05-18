"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MOCK_HARDWARE_NODES } from "@/data/mock/energy"
import { Loader2, RefreshCw, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export const HardwareConnectivity = () => {
  const [isDiagnosing, setIsDiagnosing] = React.useState<boolean>(false)
  const [diagnosticResult, setDiagnosticResult] = React.useState<string | null>(null)

  const handleDiagnose = () => {
    setIsDiagnosing(true)
    setDiagnosticResult(null)
    
    setTimeout(() => {
      setIsDiagnosing(false)
      setDiagnosticResult("All nodes online. Node 31 latency stable (120ms).")
    }, 1500)
  }

  return (
    <Card className="border border-border/50 shadow-sm bg-card text-card-foreground">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          <div>
            <CardTitle className="text-lg font-bold tracking-tight">Hardware Connectivity</CardTitle>
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
              <div key={node.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/10 bg-muted/5">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  {isOnline && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={cn(
                      "relative inline-flex rounded-full h-2.5 w-2.5",
                      isOnline ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-muted-foreground"
                    )}
                  />
                </span>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-foreground truncate">{node.id}</span>
                    <span
                      className={cn(
                        "font-semibold text-xs tracking-tight",
                        isLowSignal ? "text-amber-500" : "text-emerald-500"
                      )}
                    >
                      {node.signalStrength}% Sig
                    </span>
                  </div>
                  
                  {/* Signal Strength Progress Bar */}
                  <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden border border-border/10">
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
          <div className="text-xs p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-medium transition-all duration-200 animate-in fade-in slide-in-from-top-1">
            {diagnosticResult}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={handleDiagnose}
          variant="outline"
          disabled={isDiagnosing}
          className="w-full font-semibold transition-all duration-200 active:scale-95 text-xs tracking-wide uppercase py-4"
        >
          {isDiagnosing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Diagnose Hardware
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}