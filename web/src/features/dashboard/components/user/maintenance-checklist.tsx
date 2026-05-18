"use client"

import * as React from "react"
import { ClipboardCheck, Check, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

import { MaintenanceTicket } from "@/types/user-dashboard"

export function MaintenanceChecklist({
  ticket,
}: {
  ticket: MaintenanceTicket
}) {
  return (
    <section className="col-span-12 flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:col-span-5">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 p-8">
        <h3 className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground">
          <ClipboardCheck className="size-5 text-primary" />
          Active Maintenance Task
        </h3>
        <p className="mt-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Ticket {ticket.ticketId}
        </p>
      </div>

      {/* Checklist */}
      <div className="flex-1 space-y-4 p-8">
        {ticket.tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-center gap-4 rounded-2xl border p-4 transition-all",
              task.state === "done"
                ? "border-primary/20 bg-primary/5 opacity-60"
                : "border-border bg-muted/20"
            )}
          >
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-lg border-2",
                task.state === "done"
                  ? "border-primary bg-primary text-white"
                  : "border-muted-foreground/30"
              )}
            >
              {task.state === "done" && <Check className="size-4" />}
            </div>

            <span
              className={cn(
                "flex-1 text-sm font-bold",
                task.state === "done"
                  ? "text-foreground line-through"
                  : "text-foreground",
                task.state === "pending" && "opacity-40"
              )}
            >
              {task.label}
            </span>

            {task.state === "next" && (
              <span className="rounded bg-secondary px-2 py-1 text-[10px] font-black tracking-widest text-white uppercase">
                Next
              </span>
            )}

            {task.timestamp && (
              <span className="text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase">
                {task.timestamp}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-8 pt-0">
        <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]">
          <FileText className="size-4" />
          Update Checklist
        </button>
      </div>
    </section>
  )
}
