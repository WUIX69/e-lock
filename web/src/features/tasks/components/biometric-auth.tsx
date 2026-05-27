"use client"

import { Fingerprint } from "lucide-react"

export const BiometricAuth = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="group relative mb-4 h-32 w-32 cursor-pointer">
        <div className="absolute inset-0 animate-pulse rounded-full border border-primary/20 bg-primary/10" />
        <div className="absolute inset-4 flex items-center justify-center rounded-full bg-card text-primary shadow-lg">
          <Fingerprint className="size-12" />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-3 py-1 text-[10px] font-black tracking-widest text-secondary-foreground shadow-md">
          AS608 Sensor
        </div>
      </div>
      <p className="text-center text-xs font-bold text-primary">
        Scan Fingerprint to Authenticate
      </p>
      <p className="mt-2 max-w-[200px] text-center text-[10px] text-muted-foreground">
        By scanning, you legally attest to the accuracy of this industrial
        maintenance record.
      </p>
    </div>
  )
}
