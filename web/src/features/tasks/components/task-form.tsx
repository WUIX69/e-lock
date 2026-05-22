"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { TaskPriority, CoWorker } from "@/types/tasks"
import { ResourceSelection } from "./resource-selection"
import { TaskDetails } from "./task-details"
import { VerificationSection } from "./verification-section"
import { BiometricAuth } from "./biometric-auth"

interface TaskFormProps {
  defaultNodeId?: string
}

export const TaskForm = ({ defaultNodeId = "" }: TaskFormProps) => {
  const router = useRouter()
  const [nodeId, setNodeId] = useState(defaultNodeId)
  const [taskType, setTaskType] = useState("")
  const [subject, setSubject] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("Routine")
  const [description, setDescription] = useState("")
  const [coWorker, setCoWorker] = useState<CoWorker | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/user/nodes")
  }

  return (
    <form className="space-y-6 pb-20" onSubmit={handleSubmit}>
      <section className="form-card rounded-xl border border-border/30 bg-card p-6 shadow-md transition-all">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-green text-xs font-black text-primary">
            1
          </span>
          <h3 className="text-xl font-bold tracking-tight">Resource Selection</h3>
        </div>
        <ResourceSelection
          nodeId={nodeId}
          taskType={taskType}
          onNodeIdChange={setNodeId}
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
          className="rounded-full border border-border px-8 py-3 font-bold text-muted-foreground transition-all hover:bg-muted active:opacity-80"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110 active:opacity-80"
        >
          <Lock className="size-4" />
          Submit Record
        </button>
      </div>
    </form>
  )
}
