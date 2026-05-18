"use client"

import * as React from "react"
import Image from "next/image"
import { MapPin, ShieldCheck, Wifi, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

import { AssignedMachine } from "@/types/user-dashboard"

export function MachineStatusCard({ machine }: { machine: AssignedMachine }) {
  return (
    <section className="relative col-span-12 overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm lg:col-span-8">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black tracking-widest text-primary uppercase">
              Assigned Equipment
            </span>
            <h3 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              {machine.name} <span className="text-primary">{machine.id}</span>
            </h3>
            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="size-4 fill-primary/20 text-primary" />
              {machine.zone} — {machine.sector}
            </p>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase">
              System Runtime
            </span>
            <span className="text-2xl font-black tracking-tight text-foreground">
              {machine.runtime}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatPill
            label="Isolation Status"
            value={machine.isolationStatus}
            icon={ShieldCheck}
            iconClass="text-primary fill-primary/20"
            valueClass="text-primary"
          />
          <StatPill
            label="ESP-NOW Signal"
            value={machine.signalLatency}
            icon={Wifi}
            iconClass="text-secondary"
          />
          <StatPill
            label="Relay Health"
            value={machine.relayHealth}
            icon={Heart}
            iconClass="text-primary-foreground fill-primary-foreground/20 bg-primary rounded-md p-1 size-7"
            valueClass="text-foreground"
          />
        </div>

        {/* Footer Row */}
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-border shadow-inner md:w-1/2">
            <Image
              src={machine.imageUrl}
              alt={machine.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between rounded-2xl bg-sidebar p-6 text-sidebar-foreground">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-black tracking-wide">
                <ShieldCheck className="size-4 text-secondary-foreground" />
                Safety Directive
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-sidebar-foreground/60">
                Ensure all hydraulic lines are drained of pressure before
                initiating LOTO sequence for monthly blade sharpening.
              </p>
            </div>
            <button className="mt-4 flex items-center gap-2 text-xs font-black tracking-widest text-secondary-foreground uppercase transition-colors hover:underline">
              View Maintenance Manual
              <ShieldCheck className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatPill({
  label,
  value,
  icon: Icon,
  iconClass,
  valueClass,
}: {
  label: string
  value: string
  icon: React.ElementType
  iconClass?: string
  valueClass?: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/50 p-4 transition-colors hover:bg-muted">
      <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <Icon className={cn("size-6", iconClass)} />
        <span className={cn("text-xl font-black tracking-tight", valueClass)}>
          {value}
        </span>
      </div>
    </div>
  )
}
