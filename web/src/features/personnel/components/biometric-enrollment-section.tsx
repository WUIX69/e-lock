"use client"

import * as React from "react"
import { Fingerprint, Radio, Loader2, CheckCircle2, XCircle } from "lucide-react"
import {
  requestEnrollmentAction,
  checkEnrollmentStatusAction,
  cancelEnrollmentAction,
} from "@/features/personnel/server/actions/personnel"

interface BiometricEnrollmentSectionProps {
  fingerprintId: number | null
  setFingerprintId: (id: number | null) => void
}

export const BiometricEnrollmentSection = ({
  fingerprintId,
  setFingerprintId,
}: BiometricEnrollmentSectionProps) => {
  const [isEnrolling, setIsEnrolling] = React.useState(false)
  const [enrollmentStatus, setEnrollmentStatus] = React.useState<"idle" | "pending" | "success" | "failed">("idle")
  const [currentId, setCurrentId] = React.useState<number | null>(null)
  const pollingRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [])

  const startEnrollment = async () => {
    setIsEnrolling(true)
    setEnrollmentStatus("pending")

    const result = await requestEnrollmentAction()
    if (result.error || !result.fingerprintId) {
      setEnrollmentStatus("failed")
      setIsEnrolling(false)
      return
    }

    const fpId = result.fingerprintId
    setCurrentId(fpId)

    pollingRef.current = setInterval(async () => {
      const statusResult = await checkEnrollmentStatusAction(fpId)
      if (statusResult.status === "success") {
        setEnrollmentStatus("success")
        setFingerprintId(fpId)
        setIsEnrolling(false)
        if (pollingRef.current) clearInterval(pollingRef.current)
      } else if (statusResult.status === "expired" || statusResult.status === "failed") {
        setEnrollmentStatus("failed")
        setIsEnrolling(false)
        if (pollingRef.current) clearInterval(pollingRef.current)
      }
    }, 1000)
  }

  const cancelEnrollment = async () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
    }
    if (currentId) {
      await cancelEnrollmentAction(currentId)
    }
    setIsEnrolling(false)
    setEnrollmentStatus("idle")
    setCurrentId(null)
  }

  const clearFingerprint = () => {
    setFingerprintId(null)
    setEnrollmentStatus("idle")
  }

  const statusBadge = () => {
    switch (enrollmentStatus) {
      case "pending":
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-amber-500 uppercase">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-amber-500"></span>
            </span>
            Scanning...
          </span>
        )
      case "success":
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-green-500 uppercase">
            <CheckCircle2 className="size-3" />
            Enrolled
          </span>
        )
      case "failed":
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-destructive uppercase">
            <XCircle className="size-3" />
            Failed
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-primary uppercase">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
            </span>
            Step 1 of 3
          </span>
        )
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold tracking-tight text-foreground">
          Biometric Enrollment
        </h4>
        {statusBadge()}
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl bg-accent p-6">
        <div className="group relative mb-4 flex size-16 items-center justify-center rounded-2xl bg-background shadow-sm transition-transform hover:scale-105">
          <Fingerprint className={`size-8 ${fingerprintId ? "text-green-500" : "text-primary"}`} />
          <Radio className={`absolute -right-2 -bottom-2 size-5 animate-pulse ${fingerprintId ? "text-green-500" : "text-muted-foreground"}`} />
        </div>

        {fingerprintId ? (
          <div className="mb-4 text-center">
            <p className="text-sm font-bold text-green-500">Fingerprint #{fingerprintId} Enrolled</p>
            <p className="text-xs text-muted-foreground">Fingerprint successfully captured</p>
          </div>
        ) : enrollmentStatus === "pending" ? (
          <div className="mb-4 text-center">
            <Loader2 className="mx-auto mb-2 size-6 animate-spin text-primary" />
            <p className="mb-1 text-xs font-bold text-foreground">
              Place finger on the AS608 Scanner
            </p>
            <p className="text-[10px] text-muted-foreground">
              Waiting for fingerprint capture...
            </p>
          </div>
        ) : (
          <p className="mb-4 text-center text-xs text-muted-foreground">
            Place authorized finger on the{" "}
            <strong className="font-semibold text-foreground">
              AS608 Scanner
            </strong>{" "}
            to capture biometric template.
          </p>
        )}

        {enrollmentStatus === "pending" ? (
          <button
            type="button"
            onClick={cancelEnrollment}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-black tracking-widest text-muted-foreground uppercase transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            Cancel Enrollment
          </button>
        ) : fingerprintId ? (
          <button
            type="button"
            onClick={clearFingerprint}
            className="w-full rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs font-black tracking-widest text-destructive uppercase transition-colors hover:bg-destructive/20"
          >
            Remove Fingerprint
          </button>
        ) : (
          <button
            type="button"
            onClick={startEnrollment}
            disabled={isEnrolling}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-black tracking-widest text-primary-foreground uppercase shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isEnrolling ? "Initializing..." : "Capture Fingerprint"}
          </button>
        )}
      </div>
    </div>
  )
}
