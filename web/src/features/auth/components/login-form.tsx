"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Shield,
  Lock,
  ArrowRight,
  Fingerprint,
  ShieldAlert,
  Scale,
  CreditCard,
  Terminal,
  Network,
  Cpu,
  Wifi,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Footer } from "@/components/layout/footer"

import { loginAction } from "@/features/auth/server/actions"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      {/* Auth Page Header */}
      <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Terminal className="size-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary">
            E-LOCK Industrial
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </div>
            Gateway: Online
          </div>
          <button className="text-xs font-bold text-muted-foreground hover:text-primary">
            Technical Support
          </button>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Form */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <div className="space-y-8 rounded-3xl border border-border bg-card p-12 shadow-2xl shadow-primary/5">
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter text-primary">
                  System Access
                </h2>
                <p className="text-sm text-muted-foreground">
                  Secure terminal entry for authorized facility administrators.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
                    >
                      Email Address
                    </label>
                    <div className="group relative">
                      <CreditCard className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@elock.dev"
                        className="h-14 rounded-2xl border-border bg-muted pl-12 font-mono text-sm focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-[10px] font-bold tracking-widest text-primary uppercase hover:underline"
                      >
                        Reset PIN
                      </button>
                    </div>
                    <div className="group relative">
                      <Lock className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="h-14 rounded-2xl border-border bg-muted pl-12 font-mono text-sm focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-destructive/15 p-3 text-sm text-destructive font-bold text-center">
                    {error}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="rounded-md border-border data-[state=checked]:bg-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="cursor-pointer text-xs font-bold text-muted-foreground select-none"
                  >
                    Trust this workstation for 24 hours
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group relative h-16 w-full rounded-2xl bg-primary text-sm font-black tracking-widest text-primary-foreground uppercase shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? "Authenticating..." : "Initiate Protocol"}
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </form>

              <div className="pt-4 text-center">
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Protocol: AES-256 / Biometric Handshake
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual/Biometric */}
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[600px] overflow-hidden rounded-3xl bg-sidebar p-12 text-sidebar-foreground shadow-2xl">
              {/* Background Decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-20 -left-20 size-80 rounded-full bg-primary blur-[100px]" />
                <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-sidebar-accent-foreground blur-[100px]" />
              </div>

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/20 px-4 py-1.5 text-[10px] font-black tracking-widest text-sidebar-accent-foreground uppercase">
                    <Wifi className="size-3" />
                    Biometric Handshake Pending
                  </div>
                  <h3 className="mt-6 text-4xl font-black tracking-tighter text-white">
                    Biometric Verification Required
                  </h3>
                  <p className="mt-2 max-w-md leading-relaxed text-sidebar-foreground/60">
                    Once Worker ID is recognized, please place your registered
                    fingerprint on the AS608 sensor attached to this workstation
                    hub.
                  </p>
                </div>

                <div className="flex flex-1 items-center justify-center py-12">
                  <div className="group relative">
                    {/* Scanner Visual */}
                    <div className="absolute -inset-8 animate-pulse rounded-full bg-primary/10" />
                    <div className="absolute -inset-4 animate-pulse rounded-full bg-primary/20" />
                    <div className="relative flex size-48 items-center justify-center rounded-full border-2 border-primary/50 bg-sidebar-accent/20 shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)] backdrop-blur-sm transition-transform group-hover:scale-105">
                      <Fingerprint className="size-24 text-sidebar-accent-foreground" />
                      {/* Scanning Line */}
                      <div className="absolute top-0 left-0 h-1 w-full animate-[scan_3s_ease-in-out_infinite] bg-sidebar-accent-foreground shadow-[0_0_15px_rgba(var(--sidebar-accent-foreground),0.8)]" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-white/10 p-2">
                        <Cpu className="size-4 text-sidebar-accent-foreground" />
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                        Node Identity
                      </span>
                    </div>
                    <p className="mt-4 text-xl font-bold text-white">
                      ESP32-WROOM-32
                    </p>
                    <p className="mt-1 text-[10px] font-medium tracking-tighter text-white/30 uppercase">
                      MAC: 24:6F:28:AE:D3:8C
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-white/10 p-2">
                        <Network className="size-4 text-sidebar-accent-foreground" />
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                        Gateway Status
                      </span>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <p className="text-xl font-bold text-white">Stable</p>
                      <p className="text-[10px] font-bold text-primary">
                        98% Uptime
                      </p>
                    </div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[98%] bg-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Info Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-start gap-6 rounded-3xl border border-border bg-muted/50 p-8 transition-colors hover:bg-muted">
            <div className="rounded-2xl bg-background p-4 shadow-sm">
              <Shield className="size-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black tracking-widest uppercase">
                Encrypted Tunnel
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                All data transmission between gateway and portal is secured via
                ECC-256 encryption.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 rounded-3xl border border-border bg-muted/50 p-8 transition-colors hover:bg-muted">
            <div className="rounded-2xl bg-background p-4 shadow-sm">
              <ShieldAlert className="size-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black tracking-widest uppercase">
                Automatic Lockout
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                3 failed biometric attempts will trigger an immediate IP-level
                administrative lockout.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 rounded-3xl border border-border bg-muted/50 p-8 transition-colors hover:bg-muted">
            <div className="rounded-2xl bg-background p-4 shadow-sm">
              <Scale className="size-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black tracking-widest uppercase">
                Compliance Ready
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                System architecture adheres to ISO-45001 safety and data
                integrity standards.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes scan {
          0%,
          100% {
            top: 0;
          }
          50% {
            top: 100%;
          }
        }
      `}</style>
    </div>
  )
}
