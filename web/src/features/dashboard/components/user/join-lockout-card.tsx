"use client"

import { QrCode } from "lucide-react"
import { LockoutInvitation } from "@/types/user-dashboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface JoinLockoutCardProps {
  invitation: LockoutInvitation
}

export const JoinLockoutCard = ({ invitation }: JoinLockoutCardProps) => {
  return (
    <div className="relative flex flex-col rounded-3xl border border-sidebar-border bg-sidebar p-8 shadow-lg overflow-hidden">
      <div className="absolute top-4 right-6 text-6xl font-black text-sidebar-foreground/5 select-none leading-none pointer-events-none">
        {invitation.zoneId}
      </div>

      <h3 className="text-2xl font-black tracking-tight text-sidebar-foreground">
        Join Lockout
      </h3>

      <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-sidebar-foreground/60">
        Collaborative verification required for {invitation.equipmentName}. Scan
        partner QR to initiate.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <div className="relative">
          <Avatar className="size-10 rounded-full border-2 border-sidebar-border">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${invitation.inviterName}`}
              alt={invitation.inviterName}
            />
            <AvatarFallback className="text-xs font-bold">
              {invitation.inviterName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-black text-secondary-foreground shadow-md">
            +{invitation.participantCount - 1}
          </span>
        </div>
        <span className="text-[10px] font-black tracking-widest text-secondary-foreground/80">
          INVITATION FROM {invitation.inviterName.toUpperCase()}
        </span>
      </div>

      <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-secondary py-5 text-sm font-black tracking-widest text-secondary-foreground uppercase shadow-lg shadow-secondary/20 transition-all hover:brightness-110 active:scale-[0.98]">
        <QrCode className="size-5" />
        Pair for Safety
      </button>
    </div>
  )
}
