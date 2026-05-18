"use client"

import * as React from "react"
import { Fingerprint, Download } from "lucide-react"
import { MOCK_SETTINGS } from "../data/mock-settings"

export function SecurityAccess() {
  const [retryCount, setRetryCount] = React.useState(MOCK_SETTINGS.biometricRetryLimit)

  return (
    <div className="bg-card rounded-xl p-6 shadow-md border border-border/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-secondary/10 rounded-lg">
          <Fingerprint className="size-5 text-secondary-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Security & Access</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Biometric Scan Retry Limit
            </span>
            <span className="text-xs text-muted-foreground">
              Current Default: {retryCount} attempts
            </span>
          </div>
          <div className="flex items-center bg-white rounded-md border border-border/20">
            <button
              onClick={() => setRetryCount(Math.max(1, retryCount - 1))}
              className="px-3 py-1 hover:bg-muted transition-colors font-bold"
            >
              −
            </button>
            <span className="px-4 font-bold">{retryCount}</span>
            <button
              onClick={() => setRetryCount(Math.min(10, retryCount + 1))}
              className="px-3 py-1 hover:bg-muted transition-colors font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Global PIN Fallback Timeout
            </span>
            <span className="text-xs text-muted-foreground">Minutes until reset</span>
          </div>
          <select 
            defaultValue={MOCK_SETTINGS.pinTimeout}
            className="bg-white border border-border/20 rounded-md py-1 px-3 text-sm"
          >
            <option>5 min</option>
            <option>15 min</option>
            <option>60 min</option>
          </select>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold text-foreground">
              Firmware Update Management
            </p>
            <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-bold">
              {MOCK_SETTINGS.firmwareVersion}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="flex-grow bg-primary text-primary-foreground py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-sm">
              <Download className="size-4" />
              CHECK FOR UPDATES
            </button>
            <button className="w-12 bg-muted border border-border/20 flex items-center justify-center rounded-lg text-muted-foreground">
              <MoreHorizIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MoreHorizIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}