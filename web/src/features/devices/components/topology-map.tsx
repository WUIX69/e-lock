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
  const [activeNode, setActiveNode] = React.useState<HoveredNodeInfo | null>(
    null
  )

  const handleMouseEnterNode = (
    nodeName: string,
    signalValue: string,
    statusText: string
  ) => {
    setActiveNode({ name: nodeName, signal: signalValue, status: statusText })
  }

  const handleMouseLeaveNode = () => {
    setActiveNode(null)
  }

  return (
    <Card className="overflow-hidden rounded-[2rem] border border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between bg-card p-8 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Topology Map
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time ESP-NOW node relationship visualization
          </p>
        </div>
        <Badge
          variant="secondary"
          className="animate-pulse border-primary/20 bg-primary/10 px-3 py-1 font-bold text-primary"
        >
          LIVE SCAN
        </Badge>
      </CardHeader>

      <CardContent className="p-8">
        <div className="relative aspect-video overflow-hidden rounded-3xl border border-border/50 bg-muted/40 dark:bg-muted/10">
          <div
            className="pointer-events-none absolute inset-0 opacity-5 dark:opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(#006b2c 1.5px, transparent 1.5px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Connection Lines (Pulsing SVG Paths for state-of-the-art feel) */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <line
              x1="50%"
              y1="50%"
              x2="33.3%"
              y2="25%"
              className="stroke-primary/40 stroke-2 dark:stroke-primary/25"
              strokeDasharray="5,5"
            />
            <line
              x1="50%"
              y1="50%"
              x2="75%"
              y2="75%"
              className="stroke-primary/40 stroke-2 dark:stroke-primary/25"
              strokeDasharray="5,5"
            />
            <line
              x1="50%"
              y1="50%"
              x2="66.6%"
              y2="50%"
              className="animate-pulse stroke-destructive/40 stroke-2 dark:stroke-destructive/25"
            />
          </svg>

          {/* Central Gateway */}
          <div className="absolute top-1/2 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-2xl border border-primary-foreground/10 bg-primary text-primary-foreground shadow-xl transition-transform duration-300 hover:scale-110">
            <Router className="size-8" />
          </div>

          {/* Active Node 1 */}
          <div
            className="absolute top-1/4 left-1/3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-background bg-secondary text-secondary-foreground shadow-md transition-transform duration-300 hover:scale-110"
            onMouseEnter={() =>
              handleMouseEnterNode("Master Lock #1", "-52 dBm", "Online")
            }
            onMouseLeave={handleMouseLeaveNode}
          >
            <Lock className="size-5" style={{ fill: "currentColor" }} />
          </div>

          {/* Active Node 2 */}
          <div
            className="absolute right-1/4 bottom-1/4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-background bg-secondary text-secondary-foreground shadow-md transition-transform duration-300 hover:scale-110"
            onMouseEnter={() =>
              handleMouseEnterNode("Valve Lock #4", "-67 dBm", "Online")
            }
            onMouseLeave={handleMouseLeaveNode}
          >
            <Lock className="size-5" style={{ fill: "currentColor" }} />
          </div>

          {/* Warning Node */}
          <div
            className="absolute top-1/2 right-1/3 z-20 flex h-10 w-10 animate-pulse cursor-pointer items-center justify-center rounded-full border-4 border-background bg-destructive text-destructive-foreground shadow-md transition-transform duration-300 hover:scale-110"
            onMouseEnter={() =>
              handleMouseEnterNode("Breaker Node", "-89 dBm", "Critical Delay")
            }
            onMouseLeave={handleMouseLeaveNode}
          >
            <AlertTriangle className="size-5" />
          </div>

          {/* Legend Map Box with custom theme glassmorphism */}
          <div className="absolute bottom-4 left-4 z-30 max-w-xs rounded-2xl border border-border/50 bg-background/80 p-4 shadow-lg backdrop-blur-md dark:bg-background/90">
            {activeNode ? (
              <div className="animate-fade-in">
                <p className="mb-1 text-xs font-bold tracking-wider text-primary uppercase">
                  {activeNode.name}
                </p>
                <div className="space-y-0.5 text-[11px] font-semibold text-foreground">
                  <p>
                    Signal:{" "}
                    <span className="text-muted-foreground">
                      {activeNode.signal}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span
                      className={
                        activeNode.status === "Online"
                          ? "text-primary"
                          : "text-destructive"
                      }
                    >
                      {activeNode.status}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-2 text-xs font-bold text-muted-foreground">
                  LEGEND
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    Gateway
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
                    Active Node
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-destructive" />
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
