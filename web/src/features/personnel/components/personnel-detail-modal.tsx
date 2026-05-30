"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Shield,
  ShieldAlert,
  Circle,
  MapPin,
  Fingerprint,
  Calendar,
  Mail,
  User,
  Activity,
  Pencil,
} from "lucide-react"

interface PersonnelDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
  personnel: {
    id: string
    employeeId: string
    name: string
    email: string
    role: "admin" | "user" | string
    position: string
    securityLevel: number
    status: "active" | "inactive" | "off-site" | "on-leave" | string
    fingerprintId: number | null
    lastLocation: string | null
    lastActiveAt: Date | string | null
    createdAt?: Date | string | null
  }
}

const statusStyles: Record<string, string> = {
  active: "bg-green-500/10 text-green-500 border border-green-500/20",
  "off-site": "bg-orange-500/10 text-orange-500 border border-orange-500/20",
  "on-leave": "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  inactive: "bg-muted text-muted-foreground border border-border",
}

export const PersonnelDetailModal = ({
  open,
  onOpenChange,
  onEdit,
  personnel,
}: PersonnelDetailModalProps) => {
  const dateStr = personnel.createdAt
    ? new Date(personnel.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown"

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()

  const isAdmin = personnel.role === "admin"
  const status = personnel.status.toLowerCase()
  const levelLabel =
    personnel.securityLevel === 5
      ? `Level ${personnel.securityLevel} (Admin)`
      : personnel.securityLevel >= 4
        ? `Level ${personnel.securityLevel} (LOTO)`
        : `Level ${personnel.securityLevel}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-xl">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border bg-muted/30 px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <User className="size-5" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tighter text-foreground">
                Personnel Profile
              </DialogTitle>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                statusStyles[status] || "bg-muted text-muted-foreground"
              }`}
            >
              <Circle className="size-1.5 fill-current" />
              {personnel.status.replace("-", " ")}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary`}
            >
              {isAdmin ? (
                <ShieldAlert className="size-3" />
              ) : (
                <Shield className="size-3" />
              )}
              {levelLabel}
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
              ID: {personnel.employeeId}
            </span>
          </div>

          <div className="flex items-center gap-4 py-2">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                {initials(personnel.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-black tracking-tighter text-foreground leading-tight">
                {personnel.name}
              </h3>
              <p className="text-sm font-mono text-muted-foreground">
                {personnel.position}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex gap-3 rounded-xl border border-border/30 bg-muted/30 p-4">
              <MapPin className="size-5 shrink-0 text-primary mt-0.5" />
              <div>
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Assigned Location
                </p>
                <p className="text-lg font-bold text-foreground leading-tight mt-1">
                  {personnel.lastLocation || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl border border-border/30 bg-muted/30 p-4">
              <Activity className="size-5 shrink-0 text-primary mt-0.5" />
              <div>
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  User Role
                </p>
                <p className="text-lg font-bold text-foreground leading-tight mt-1 capitalize">
                  {personnel.role}
                </p>
              </div>
            </div>
          </div>

          {/* Biometrics Profile */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Fingerprint className="size-4 text-primary" />
              <h4 className="text-base font-bold tracking-tight text-foreground">
                Biometric Clearance Profile
              </h4>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Fingerprint Registration:
                </span>
                <span className="font-mono font-bold text-foreground">
                  {personnel.fingerprintId !== null
                    ? `Registered (ID: #${personnel.fingerprintId})`
                    : "No Biometrics Registered"}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-border/30 pt-2">
                <span className="text-muted-foreground font-medium">
                  Biometric Access Rights:
                </span>
                <span className="font-bold text-primary">
                  {personnel.securityLevel >= 4
                    ? "LOTO Isolation Authorized"
                    : "Standard Operational Access"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details & Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Mail className="size-4 text-primary" />
              <h4 className="text-base font-bold tracking-tight text-foreground">
                Contact & History
              </h4>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                <Mail className="size-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {personnel.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                <Calendar className="size-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Enrollment Date
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {dateStr}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-6 py-4">
          {onEdit && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-xs text-primary transition-all hover:bg-primary/20 active:scale-95"
              onClick={() => {
                onOpenChange(false)
                onEdit()
              }}
              aria-label="Edit personnel"
            >
              <Pencil className="size-3.5" />
              <span className="font-bold uppercase tracking-wider text-[10px]">
                Edit
              </span>
            </button>
          )}
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs text-foreground transition-all hover:bg-muted active:scale-95"
            onClick={() => window.print()}
          >
            <span>🖨</span>
            <span className="font-bold uppercase tracking-wider text-[10px]">
              Print Profile
            </span>
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-95"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
