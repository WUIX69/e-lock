"use client"

import * as React from "react"
import Link from "next/link"
import { Terminal, Globe, MessageSquare, Share2 } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded bg-primary text-primary-foreground">
                <Terminal className="size-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-primary">
                E-LOCK
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Industrial-grade Lockout-Tagout (LOTO) management system. Secure,
              biometric-verified isolation protocols for critical
              infrastructure.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Globe className="size-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <MessageSquare className="size-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Share2 className="size-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold tracking-widest text-foreground uppercase">
              Product
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/audit" className="hover:text-primary">
                  Audit Logs
                </Link>
              </li>
              <li>
                <Link href="/personnel" className="hover:text-primary">
                  Personnel
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Hardware Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold tracking-widest text-foreground uppercase">
              Resources
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Safety Protocols
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold tracking-widest text-foreground uppercase">
              Legal
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Compliance
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} E-LOCK Industrial Systems. All
            rights reserved. System Version: 1.2.4-stable
          </p>
        </div>
      </div>
    </footer>
  )
}
