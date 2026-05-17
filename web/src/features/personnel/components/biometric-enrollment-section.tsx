import { Fingerprint, Radio } from "lucide-react"

export const BiometricEnrollmentSection = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold tracking-tight text-foreground">
          Biometric Enrollment
        </h4>
        <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-primary uppercase">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
          </span>
          Step 1 of 3
        </span>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl bg-accent p-6">
        <div className="group relative mb-4 flex size-16 items-center justify-center rounded-2xl bg-background shadow-sm transition-transform hover:scale-105">
          <Fingerprint className="size-8 text-primary" />
          <Radio className="absolute -right-2 -bottom-2 size-5 animate-pulse text-muted-foreground" />
        </div>
        
        <p className="mb-4 text-center text-xs text-muted-foreground">
          Place authorized finger on the <strong className="font-semibold text-foreground">AS608 Scanner</strong> to capture biometric template.
        </p>

        <button
          type="button"
          disabled
          className="w-full rounded-xl bg-background border border-border px-4 py-2.5 text-xs font-black tracking-widest text-muted-foreground uppercase opacity-50 cursor-not-allowed"
        >
          Capture Fingerprint (Pending hardware)
        </button>
      </div>
    </div>
  )
}
