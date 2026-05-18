"use client"

import * as React from "react"
import { MOCK_HARDWARE_NODES } from "../data/mock-energy"

export function HardwareConnectivity() {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">
        Hardware Connectivity
      </h3>
      <div className="space-y-4">
        {MOCK_HARDWARE_NODES.map((node) => (
          <div key={node.id} className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                node.status === "online"
                  ? "bg-primary animate-pulse"
                  : node.status === "warning"
                  ? "bg-destructive"
                  : "bg-muted"
              }`}
            />
            <div className="flex-grow">
              <div className="font-bold text-sm text-foreground">{node.id}</div>
              <div className="w-full bg-muted h-1 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    node.signalStrength < 50 ? "bg-destructive" : "bg-primary"
                  }`}
                  style={{ width: `${node.signalStrength}%` }}
                />
              </div>
            </div>
            <div
              className={`font-bold text-xs ${
                node.signalStrength < 50 ? "text-destructive" : "text-primary"
              }`}
            >
              {node.signalStrength}% Sig
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2 border border-border rounded-lg text-sm font-bold text-muted-foreground hover:bg-muted transition-colors">
        DIAGNOSE HARDWARE
      </button>
    </div>
  )
}