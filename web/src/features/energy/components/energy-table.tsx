"use client"

import * as React from "react"
import { Zap, Wind, Droplets, Waves, MoreHorizontal } from "lucide-react"
import { MOCK_ENERGY_SOURCES } from "../data/mock-energy"

const typeIcons = {
  electrical: Zap,
  pneumatic: Wind,
  hydraulic: Droplets,
  chemical: Waves,
}

const statusStyles = {
  connected: "bg-primary/10 text-primary border-primary/20",
  isolated: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  warning: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusLabels = {
  connected: "CONNECTED",
  isolated: "ISOLATED",
  warning: "WARNING",
}

export function EnergyTable() {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
        <h3 className="text-lg font-bold text-foreground">Source Registry</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Source Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Hardware
              </th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {MOCK_ENERGY_SOURCES.map((source) => {
              const Icon = typeIcons[source.type]
              return (
                <tr
                  key={source.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-5">
                    <div className="font-bold text-foreground">{source.name}</div>
                    <div className="text-xs text-muted-foreground">ID: {source.id}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      <span className="capitalize text-foreground">
                        {source.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-foreground">{source.location}</div>
                    <div className="text-xs text-muted-foreground">
                      {source.gridZone}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-muted px-3 py-1 rounded-full text-xs border border-border/30">
                      {source.hardwareNode}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        statusStyles[source.status]
                      }`}
                    >
                      {statusLabels[source.status]}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}