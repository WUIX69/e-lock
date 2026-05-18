"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Eye, EyeOff, Loader2, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  addPersonnelAction,
  editPersonnelAction,
} from "@/features/personnel/server/actions"
import { BiometricEnrollmentSection } from "@/features/personnel/components/biometric-enrollment-section"
import { PersonnelRow } from "@/features/personnel/components/columns"

interface PersonnelFormAddProps {
  mode: "add"
  personnel?: never
  onSuccess: () => void
  onCancel: () => void
}

interface PersonnelFormEditProps {
  mode: "edit"
  personnel: PersonnelRow
  onSuccess: () => void
  onCancel: () => void
}

type PersonnelFormProps = PersonnelFormAddProps | PersonnelFormEditProps

export const PersonnelForm = ({
  mode,
  personnel,
  onSuccess,
  onCancel,
}: PersonnelFormProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const [showPin, setShowPin] = React.useState<boolean>(false)

  const isEditMode = mode === "edit"
  const [employeeId] = React.useState<string>(
    () =>
      personnel?.employeeId ??
      `EL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    if (isEditMode && personnel) {
      formData.append("id", personnel.id)
    }

    const serverAction = isEditMode ? editPersonnelAction : addPersonnelAction

    try {
      const result = await serverAction(formData)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
      } else {
        router.refresh()
        onSuccess()
      }
    } catch (submissionError) {
      console.error("Form submission error:", submissionError)
      setError("An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <Label
          htmlFor="fullName"
          className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
        >
          Full Name
        </Label>
        <div className="group relative">
          <User className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="fullName"
            name="fullName"
            defaultValue={isEditMode ? personnel?.name : undefined}
            placeholder="Sarah Jenkins"
            className="h-14 rounded-2xl border-border bg-muted pl-12 font-mono text-sm focus-visible:ring-primary"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor="email"
          className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
        >
          Email Address
        </Label>
        <div className="group relative">
          <Mail className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={isEditMode ? personnel?.email : undefined}
            placeholder="sarah@elock.dev"
            className="h-14 rounded-2xl border-border bg-muted pl-12 font-mono text-sm focus-visible:ring-primary"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label
            htmlFor="employeeId"
            className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
          >
            Employee ID {!isEditMode && "(Auto)"}
          </Label>
          <Input
            id="employeeId"
            name="employeeId"
            value={employeeId}
            readOnly
            className="h-14 rounded-2xl border-border bg-muted/50 font-mono text-sm opacity-70"
          />
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="role"
            className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
          >
            System Role
          </Label>
          <Select
            name="role"
            defaultValue={isEditMode ? personnel?.role : "user"}
            disabled={isLoading}
          >
            <SelectTrigger className="h-14 w-full rounded-2xl border-border bg-muted px-4 py-6 font-mono text-sm focus:ring-primary">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="p-2">
              <SelectItem value="user">User (Operator)</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor="position"
          className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
        >
          Position
        </Label>
        <Input
          id="position"
          name="position"
          defaultValue={isEditMode ? personnel?.position : undefined}
          placeholder="e.g. SENIOR ELECTRICIAN"
          className="h-14 rounded-2xl border-border bg-muted font-mono text-sm uppercase focus-visible:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label
            htmlFor="securityLevel"
            className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
          >
            Security Level
          </Label>
          <Select
            name="securityLevel"
            defaultValue={isEditMode ? personnel?.securityLevel : "Level 2"}
            disabled={isLoading}
          >
            <SelectTrigger className="h-14 w-full rounded-2xl border-border bg-muted px-4 py-6 font-mono text-sm focus:ring-primary">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent className="p-2">
              <SelectItem value="Level 1">Level 1</SelectItem>
              <SelectItem value="Level 2">Level 2</SelectItem>
              <SelectItem value="Level 3">Level 3</SelectItem>
              <SelectItem value="Level 4 (LOTO)">Level 4 (LOTO)</SelectItem>
              <SelectItem value="Level 5 (Admin)">Level 5 (Admin)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="status"
            className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
          >
            Current Status
          </Label>
          <Select
            name="status"
            defaultValue={isEditMode ? personnel?.status : "active"}
            disabled={isLoading}
          >
            <SelectTrigger className="h-14 w-full rounded-2xl border-border bg-muted px-4 py-6 font-mono text-sm focus:ring-primary">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="p-2">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="off-site">Off-Site</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor="pin"
          className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
        >
          {isEditMode ? "Update Secure PIN (Optional)" : "Secure PIN"}
        </Label>
        <div className="group relative">
          <Lock className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="pin"
            name="pin"
            type={showPin ? "text" : "password"}
            placeholder={
              isEditMode ? "Leave blank to keep current PIN" : "••••"
            }
            maxLength={4}
            pattern="\d{4}"
            title="PIN must be exactly 4 digits"
            className="h-14 rounded-2xl border-border bg-muted px-12 font-mono text-sm tracking-widest focus-visible:ring-primary"
            required={!isEditMode}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            tabIndex={-1}
            aria-label={showPin ? "Hide PIN" : "Show PIN"}
            disabled={isLoading}
          >
            {showPin ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
      </div>

      <BiometricEnrollmentSection />

      <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex h-12 items-center justify-center rounded-xl bg-muted px-6 text-xs font-black tracking-widest text-muted-foreground uppercase transition-colors hover:bg-muted/80 disabled:opacity-50 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "flex h-12 items-center justify-center gap-2 rounded-xl bg-sidebar px-6 text-xs font-black tracking-widest text-sidebar-foreground uppercase shadow-lg transition-transform sm:w-auto",
            isLoading
              ? "cursor-not-allowed opacity-70"
              : "hover:scale-105 active:scale-95"
          )}
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {isEditMode ? "Save Changes" : "Confirm Registration"}
        </button>
      </div>
    </form>
  )
}
