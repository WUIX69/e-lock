"use client"

import { cn } from "@/lib/utils"
import { FailSafeHardwareRow } from "@/types/user-dashboard"

export function HardwareStatusList({ loto }: { loto: FailSafeHardwareRow[] }) {
  return (
    <section className="col-span-12 flex flex-col gap-6 lg:col-span-4">
      {/* Hardware Status List */}
      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h4 className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
          Fail-Safe Hardware
        </h4>

        <div className="space-y-4">
          {loto.map((hw) => (
            <div key={hw.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
                  <hw.icon
                    className={cn(
                      "size-5",
                      hw.statusVariant === "ready"
                        ? "text-primary"
                        : "text-secondary"
                    )}
                  />
                </div>
                <span className="text-sm font-bold text-foreground">
                  {hw.label}
                </span>
              </div>
              <span
                className={cn(
                  "rounded px-2 py-1 text-[10px] font-black tracking-widest uppercase",
                  hw.statusVariant === "ready"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/10 text-secondary"
                )}
              >
                {hw.statusLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
