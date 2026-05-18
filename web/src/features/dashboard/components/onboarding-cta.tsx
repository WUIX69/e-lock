"use client"

import * as React from "react"
import { UserPlus, ArrowRight } from "lucide-react"
import Link from "next/link"

export const OnboardingCta = () => {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-primary p-8 shadow-lg md:col-span-1 lg:col-span-2">
      <div className="absolute -right-8 -bottom-8 opacity-10">
        <UserPlus className="size-48" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary-foreground/20 p-2">
            <UserPlus className="size-5 text-primary-foreground" />
          </div>
          <h4 className="text-xs font-black tracking-widest text-primary-foreground uppercase">
            Personnel Onboarding
          </h4>
        </div>

        <p className="max-w-sm text-sm leading-relaxed font-medium text-primary-foreground/80">
          Streamline facility access by registering new personnel. Biometric
          profiles will be securely provisioned to authorized nodes.
        </p>
      </div>

      <div className="relative z-10 mt-8">
        <Link
          href="/personnel"
          className="group inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 text-xs font-black tracking-widest text-primary uppercase transition-transform hover:scale-105"
        >
          Register New Personnel
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
