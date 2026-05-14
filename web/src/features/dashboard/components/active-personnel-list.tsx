"use client"

import * as React from "react"
import { Fingerprint, MoreHorizontal } from "lucide-react"
import { MOCK_ACTIVE_PERSONNEL } from "@/data/mock/personnel"

export const ActivePersonnelList = () => {
  return (
    <div className="col-span-1 lg:col-span-2 rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-black uppercase tracking-widest text-foreground">
            Active Personnel
          </h4>
          <span className="rounded-full bg-secondary px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-secondary-foreground">
            {MOCK_ACTIVE_PERSONNEL.length} Secured
          </span>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="size-5" />
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {MOCK_ACTIVE_PERSONNEL.map((person) => (
          <div
            key={person.name}
            className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Fingerprint className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{person.name}</p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {person.role}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs font-mono font-bold text-primary">
                {person.time}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground/40 uppercase">
                {person.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full rounded-xl border border-dashed border-border py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground">
        View All Shift Activity
      </button>
    </div>
  )
}
