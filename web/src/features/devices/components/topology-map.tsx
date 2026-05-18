"use client"

import * as React from "react"
import { Lock, Router, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HoveredNodeInfo {
  name: string
  signal: string
  status: string
}

export const TopologyMap = () => {
  const [activeNode, setActiveNode] = React.useState<HoveredNodeInfo | null>(null)

  const handleMouseEnterNode = (nodeName: string, signalValue: string, statusText: string) => {
    setActiveNode({ name: nodeName, signal: signalValue, status: statusText })
  }

  const handleMouseLeaveNode = () => {
    setActiveNode(null)
  }

  return (
    <Card className="rounded-[2rem] shadow-lg border border-border/50 overflow-hidden">
      <CardHeader className="p-8 pb-4 flex flex-row justify-between items-start bg-card">
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">Topology Map</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time ESP-NOW node relationship visualization
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 animate-pulse"
        >
          LIVE SCAN
        </Badge>
      </CardHeader>

      <CardContent className="p-8">
        <div className="aspect-video bg-muted/40 dark:bg-muted/10 rounded-3xl overflow-hidden relative border border-border/50">
          <div
            className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#006b2c 1.5px, transparent 1.5px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Connection Lines (Pulsing SVG Paths for state-of-the-art feel) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <line
              x1="50%"
              y1="50%"
              x2="33.3%"
              y2="25%"
              className="stroke-primary/40 dark:stroke-primary/25 stroke-2"
              strokeDasharray="5,5"
            />
            <line
              x1="50%"
              y1="50%"
              x2="75%"
              y2="75%"
              className="stroke-primary/40 dark:stroke-primary/25 stroke-2"
              strokeDasharray="5,5"
            />
            <line
              x1="50%"
              y1="50%"
              x2="66.6%"
              y2="50%"
              className="stroke-destructive/40 dark:stroke-destructive/25 stroke-2 animate-pulse"
            />
          </svg>

          {/* Central Gateway */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl z-10 border border-primary-foreground/10 hover:scale-110 transition-transform duration-300 cursor-pointer">
            <Router className="size-8" />
          </div>

          {/* Active Node 1 */}
          <div
            className="absolute top-1/4 left-1/3 w-10 h-10 bg-secondary rounded-full border-4 border-background flex items-center justify-center text-secondary-foreground shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer z-20"
            onMouseEnter={() => handleMouseEnterNode("Master Lock #1", "-52 dBm", "Online")}
            onMouseLeave={handleMouseLeaveNode}
          >
            <Lock className="size-5" style={{ fill: "currentColor" }} />
          </div>

          {/* Active Node 2 */}
          <div
            className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-secondary rounded-full border-4 border-background flex items-center justify-center text-secondary-foreground shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer z-20"
            onMouseEnter={() => handleMouseEnterNode("Valve Lock #4", "-67 dBm", "Online")}
            onMouseLeave={handleMouseLeaveNode}
          >
            <Lock className="size-5" style={{ fill: "currentColor" }} />
          </div>

          {/* Warning Node */}
          <div
            className="absolute top-1/2 right-1/3 w-10 h-10 bg-destructive rounded-full border-4 border-background flex items-center justify-center text-destructive-foreground shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer z-20 animate-pulse"
            onMouseEnter={() => handleMouseEnterNode("Breaker Node", "-89 dBm", "Critical Delay")}
            onMouseLeave={handleMouseLeaveNode}
          >
            <AlertTriangle className="size-5" />
          </div>

          {/* Legend Map Box with custom theme glassmorphism */}
          <div className="absolute bottom-4 left-4 p-4 bg-background/80 dark:bg-background/90 backdrop-blur-md rounded-2xl shadow-lg border border-border/50 max-w-xs z-30">
            {activeNode ? (
              <div className="animate-fade-in">
                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{activeNode.name}</p>
                <div className="text-[11px] font-semibold text-foreground space-y-0.5">
                  <p>Signal: <span className="text-muted-foreground">{activeNode.signal}</span></p>
                  <p>Status: <span className={activeNode.status === "Online" ? "text-primary" : "text-destructive"}>{activeNode.status}</span></p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2">LEGEND</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-foreground font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    Gateway
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    Active Node
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                    Warning
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}