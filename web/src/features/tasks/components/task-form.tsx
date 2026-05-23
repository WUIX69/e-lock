"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { TaskPriority, CoWorker } from "@/types/tasks"
import { Device } from "@/types/devices"
import { ResourceSelection } from "./resource-selection"
import { TaskDetails } from "./task-details"
import { VerificationSection } from "./verification-section"
import { BiometricAuth } from "./biometric-auth"
import { submitTaskAction } from "@/features/tasks/server/actions/tasks"

interface TaskFormProps {
  defaultDeviceId?: string
  devices: Device[]
  coworkers: CoWorker[]
}

export const TaskForm = ({
  defaultDeviceId = "",
  devices,
  coworkers,
}: TaskFormProps) => {
  const router = useRouter()
  const [deviceId, setDeviceId] = useState(defaultDeviceId)
  const [taskType, setTaskType] = useState("")
  const [subject, setSubject] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("Routine")
  const [description, setDescription] = useState("")
  const [coWorker, setCoWorker] = useState<CoWorker | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData()
    formData.set("deviceId", deviceId)
    formData.set("taskType", taskType)
    formData.set("subject", subject)
    formData.set("priority", priority)
    formData.set("description", description)
    if (coWorker) {
      formData.set("coWorkerId", coWorker.id)
      formData.set("coWorkerName", coWorker.name)
    }

    const result = await submitTaskAction(formData)
    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }

    router.push("/user/my-activity")
  }

  return (
    <form className="space-y-6 pb-20" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      <section className="form-card rounded-xl border border-border/30 bg-card p-6 shadow-md transition-all">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-green text-xs font-black text-primary">
            1
          </span>
          <h3 className="text-xl font-bold tracking-tight">Resource Selection</h3>
        </div>
        <ResourceSelection
          deviceId={deviceId}
          taskType={taskType}
          devices={devices}
          defaultDeviceId={defaultDeviceId}
          onDeviceIdChange={setDeviceId}
          onTaskTypeChange={setTaskType}
        />
      </section>

      <section className="form-card rounded-xl border border-border/30 bg-card p-6 shadow-md transition-all">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-green text-xs font-black text-primary">
            2
          </span>
          <h3 className="text-xl font-bold tracking-tight">Task Details</h3>
        </div>
        <TaskDetails
          subject={subject}
          priority={priority}
          description={description}
          onSubjectChange={setSubject}
          onPriorityChange={setPriority}
          onDescriptionChange={setDescription}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="form-card flex h-full flex-col rounded-xl border border-border/30 bg-card p-6 shadow-md transition-all">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-green text-xs font-black text-primary">
              3
            </span>
            <h3 className="text-xl font-bold tracking-tight">Verification</h3>
          </div>
          <VerificationSection
            selectedCoWorker={coWorker}
            onSelectCoWorker={setCoWorker}
            coworkers={coworkers}
          />
        </section>

        <section className="form-card flex h-full flex-col rounded-xl border border-border/30 bg-card p-6 shadow-md transition-all">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-green text-xs font-black text-primary">
              4
            </span>
            <h3 className="text-xl font-bold tracking-tight">Biometric Auth</h3>
          </div>
          <BiometricAuth />
        </section>
      </div>

      <div className="flex items-center justify-end gap-4 pt-8">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-full border border-border px-8 py-3 font-bold text-muted-foreground transition-all hover:bg-muted active:opacity-80 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110 active:opacity-80 disabled:opacity-50"
        >
          <Lock className="size-4" />
          {isSubmitting ? "Submitting..." : "Submit Record"}
        </button>
      </div>
    </form>
  )
}
