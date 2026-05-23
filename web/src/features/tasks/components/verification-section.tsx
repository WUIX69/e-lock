"use client"

import { Search, X } from "lucide-react"
import { useState, useMemo } from "react"
import { CoWorker } from "@/types/tasks"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface VerificationSectionProps {
  selectedCoWorker: CoWorker | null
  onSelectCoWorker: (coworker: CoWorker | null) => void
  coworkers: CoWorker[]
}

export const VerificationSection = ({
  selectedCoWorker,
  onSelectCoWorker,
  coworkers,
}: VerificationSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(
    () =>
      coworkers.filter(
        (cw) =>
          cw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (cw.employeeId || cw.id).includes(searchQuery)
      ),
    [searchQuery, coworkers]
  )

  return (
    <div className="space-y-4">
      <p className="font-body-md text-muted-foreground">
        Multi-person safety protocols require a co-worker to verify this
        lockout/tagout state.
      </p>

      {!selectedCoWorker ? (
        <div className="relative">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted p-3 pr-12 font-body-md text-foreground transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Search co-worker by ID or name..."
            type="text"
          />
          <Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

          {searchQuery && filtered.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card p-2 shadow-xl">
              {filtered.map((cw) => (
                <button
                  key={cw.id}
                  type="button"
                  onClick={() => {
                    onSelectCoWorker(cw)
                    setSearchQuery("")
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                >
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarFallback className="text-xs font-bold">
                      {cw.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground">{cw.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {cw.employeeId || cw.id} &middot; {cw.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-border/20 bg-muted p-3">
          <Avatar className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            <AvatarFallback>
              {selectedCoWorker.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-xs font-bold text-foreground">
              {selectedCoWorker.name} (ID: {selectedCoWorker.employeeId || selectedCoWorker.id})
            </p>
            <p className="text-xs text-muted-foreground">{selectedCoWorker.role}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelectCoWorker(null)}
            className="rounded-full p-1 text-destructive transition-colors hover:bg-destructive/10"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
