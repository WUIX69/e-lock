"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { TaskPriority, CoWorker } from "@/types/tasks"
import { Device } from "@/types/devices"
import { ResourceSelection } from "./resource-selection"
import { TaskDetails } from "./task-details"
import { VerificationSection } from "./verification-section"
import { BiometricAuth } from "./biometric-auth"
import { useAuth } from "@/context/auth-context"
import {
  submitTaskAction,
  updateTaskAction,
  getTaskForEditAction,
} from "@/features/tasks/server/actions/tasks"

interface TaskFormProps {
  defaultDeviceId?: string
  devices: Device[]
  coworkers: CoWorker[]
  taskId?: string
}

export const TaskForm = ({
  defaultDeviceId = "",
  devices,
  coworkers,
  taskId,
}: TaskFormProps) => {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [deviceId, setDeviceId] = useState(defaultDeviceId)
  const [taskType, setTaskType] = useState("")
  const [subject, setSubject] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("Routine")
  const [description, setDescription] = useState("")
  const [coWorkers, setCoWorkers] = useState<CoWorker[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(!!taskId)
  const [attachments, setAttachments] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<
    { id: string; fileName: string; filePath: string }[]
  >([])
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<string[]>([])

  useEffect(() => {
    if (!taskId) return

    getTaskForEditAction(taskId).then((result) => {
      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      const task = result.task as {
        deviceId: string
        taskType: string
        subject: string
        priority: string
        description: string | null
        coWorkers: { id: string; name: string }[]
        submissionAttachments?: { id: string; fileName: string; filePath: string; category: string }[]
      }
      setDeviceId(task.deviceId)
      setTaskType(task.taskType)
      setSubject(task.subject)
      setPriority(task.priority as TaskPriority)
      setDescription(task.description || "")

      const atts = task.submissionAttachments
      if (atts && atts.length > 0) {
        setExistingAttachments(
          atts.map((a) => ({
            id: a.id,
            fileName: a.fileName,
            filePath: a.filePath,
          }))
        )
      }

      if (task.coWorkers?.length > 0) {
        const matched: CoWorker[] = task.coWorkers
          .map((cw: { id: string; name: string }) => {
            const found = coworkers.find((c) => c.id === cw.id)
            return (
              found || {
                id: cw.id,
                name: cw.name,
                role: "Co-worker",
              }
            )
          })
          .filter(Boolean)
        setCoWorkers(matched)
      }

      setLoading(false)
    })
  }, [taskId, coworkers])

  const handleRemoveExisting = (id: string) => {
    setDeletedAttachmentIds((prev) => [...prev, id])
    setExistingAttachments((prev) => prev.filter((a) => a.id !== id))
  }

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

    if (coWorkers.length > 0) {
      formData.set(
        "coWorkerIds",
        JSON.stringify(coWorkers.map((cw) => cw.id))
      )
      formData.set(
        "coWorkerNames",
        JSON.stringify(coWorkers.map((cw) => cw.name))
      )
    } else {
      formData.set("coWorkerIds", "[]")
      formData.set("coWorkerNames", "[]")
    }

    formData.set("attachments", JSON.stringify(attachments.map((f) => f.name)))
    for (const file of attachments) {
      formData.append("files", file)
    }

    let result
    if (taskId) {
      formData.set("id", taskId)
      formData.set(
        "deletedAttachmentIds",
        JSON.stringify(deletedAttachmentIds)
      )
      result = await updateTaskAction(formData)
    } else {
      result = await submitTaskAction(formData)
    }

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }

    router.push("/tasks")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Loading task...</p>
      </div>
    )
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
          <h3 className="text-xl font-bold tracking-tight">
            {taskId ? "Resource" : "Resource Selection"}
          </h3>
        </div>
        <ResourceSelection
          deviceId={deviceId}
          taskType={taskType}
          devices={devices}
          defaultDeviceId={defaultDeviceId}
          userSecurityLevel={currentUser?.securityLevel}
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
          attachments={attachments}
          existingAttachments={existingAttachments}
          taskType={taskType}
          userSecurityLevel={currentUser?.securityLevel}
          onSubjectChange={setSubject}
          onPriorityChange={setPriority}
          onDescriptionChange={setDescription}
          onAttachmentsChange={setAttachments}
          onRemoveExisting={handleRemoveExisting}
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
            selectedCoWorkers={coWorkers}
            onCoWorkersChange={setCoWorkers}
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
          {isSubmitting
            ? "Submitting..."
            : taskId
              ? "Update Record"
              : "Submit Record"}
        </button>
      </div>
    </form>
  )
}
