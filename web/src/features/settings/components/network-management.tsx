"use client"

import * as React from "react"
import { Network, Wifi } from "lucide-react"
import { NETWORK_STATS } from "../data/mock-settings"

export function NetworkManagement() {
  const pairingPercentage = (NETWORK_STATS.nodePairing.used / NETWORK_STATS.nodePairing.total) * 100

  return (
    <div className="bg-sidebar text-sidebar-foreground rounded-xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 opacity-10">
        <Wifi className="text-[200px]" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-lg">
              <Network className="size-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Network Management</h3>
              <p className="text-xs text-muted-foreground">Active Mesh Protocol: ESP-NOW</p>
            </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors">
            SCAN NODES
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-muted-foreground uppercase font-bold mb-2">
              Signal Strength
            </p>
            <div className="flex items-end gap-1 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <div className="w-2 h-4 bg-primary rounded-full" />
              <div className="w-2 h-6 bg-primary rounded-full" />
              <div className="w-2 h-8 bg-primary rounded-full" />
              <span className="ml-2 text-2xl font-black">{NETWORK_STATS.signalStrength} dBm</span>
            </div>
            <p className="text-xs text-primary">{NETWORK_STATS.signalStatus}</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-muted-foreground uppercase font-bold mb-2">
              Node Pairing
            </p>
            <p className="text-2xl font-black mb-2">
              {NETWORK_STATS.nodePairing.used} / {NETWORK_STATS.nodePairing.total}
            </p>
            <div className="w-full bg-white/10 h-1 rounded-full">
              <div
                className="bg-secondary h-full rounded-full"
                style={{ width: `${pairingPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Capacity remaining</p>
          </div>
        </div>
      </div>
    </div>
  )
}