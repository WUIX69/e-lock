"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { CoWorker } from "@/types/tasks"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface VerificationSectionProps {
  selectedCoWorkers: CoWorker[]
  onCoWorkersChange: (coworkers: CoWorker[]) => void
  coworkers: CoWorker[]
}

export const VerificationSection = ({
  selectedCoWorkers,
  onCoWorkersChange,
  coworkers,
}: VerificationSectionProps) => {
  const [open, setOpen] = useState(false)

  const selectedIds = useMemo(
    () => new Set(selectedCoWorkers.map((cw) => cw.id)),
    [selectedCoWorkers]
  )

  const handleToggle = (cw: CoWorker) => {
    if (selectedIds.has(cw.id)) {
      onCoWorkersChange(selectedCoWorkers.filter((s) => s.id !== cw.id))
    } else {
      onCoWorkersChange([...selectedCoWorkers, cw])
    }
  }

  return (
    <div className="space-y-4">
      <p className="font-body-md text-muted-foreground">
        Multi-person safety protocols require a co-worker to verify this
        lockout/tagout state.
      </p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="font-body-md w-full justify-between rounded-lg border-border bg-muted px-3 py-6 text-foreground hover:bg-muted/80"
          >
            {selectedCoWorkers.length > 0
              ? `${selectedCoWorkers.length} co-worker${selectedCoWorkers.length > 1 ? "s" : ""} selected`
              : "Search co-workers..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search by name or ID..." />
            <CommandList>
              <CommandEmpty>No employees found.</CommandEmpty>
              <CommandGroup>
                {coworkers.map((cw) => (
                  <CommandItem
                    key={cw.id}
                    value={`${cw.name} ${cw.employeeId || cw.id}`}
                    onSelect={() => handleToggle(cw)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedIds.has(cw.id)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {selectedIds.has(cw.id) && <Check className="h-3 w-3" />}
                    </div>
                    <Avatar className="mr-2 h-7 w-7 rounded-full">
                      <AvatarFallback className="text-[10px] font-bold">
                        {cw.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{cw.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {cw.employeeId || cw.id} &middot; {cw.role}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCoWorkers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCoWorkers.map((cw) => (
            <div
              key={cw.id}
              className="flex items-center gap-1.5 rounded-full border border-border/20 bg-muted px-3 py-1.5"
            >
              <Avatar className="h-5 w-5 rounded-full">
                <AvatarFallback className="text-[8px] font-bold">
                  {cw.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground">
                {cw.name}
              </span>
              <button
                type="button"
                onClick={() => handleToggle(cw)}
                className="ml-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
