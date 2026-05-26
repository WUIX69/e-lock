"use client"

import { Camera, X } from "lucide-react"
import { TaskPriority } from "@/types/tasks"

interface TaskDetailsProps {
  subject: string
  priority: TaskPriority
  description: string
  attachments: string[]
  taskType: string
  userSecurityLevel?: number
  onSubjectChange: (value: string) => void
  onPriorityChange: (value: TaskPriority) => void
  onDescriptionChange: (value: string) => void
  onAttachmentsChange: (value: string[]) => void
}

const priorities: TaskPriority[] = ["Routine", "High", "Critical"]

const STRICT_TASK_TYPES = ["Preventative Maintenance", "Emergency Repair"]

export const TaskDetails = ({
  subject,
  priority,
  description,
  attachments,
  taskType,
  userSecurityLevel,
  onSubjectChange,
  onPriorityChange,
  onDescriptionChange,
  onAttachmentsChange,
}: TaskDetailsProps) => {
  const securityLevel = userSecurityLevel ?? 0
  const isStrict = STRICT_TASK_TYPES.includes(taskType)
  const requiresAttachments = securityLevel >= 4 && isStrict

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newFiles = Array.from(files).map((f) => f.name)
    onAttachmentsChange([...attachments, ...newFiles])
  }

  const removeFile = (fileName: string) => {
    onAttachmentsChange(attachments.filter((f) => f !== fileName))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2 md:col-span-2">
          <label className="block px-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            Subject
          </label>
          <input
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted p-3 font-body-md text-foreground transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Brief summary of work..."
            type="text"
          />
        </div>
        <div className="space-y-2">
          <label className="block px-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            Priority
          </label>
          <div className="flex rounded-lg border border-border bg-muted p-1">
            {priorities.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPriorityChange(p)}
                className={`flex-1 rounded-md py-2 text-center text-[10px] font-black tracking-wider transition-all ${
                  priority === p
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block px-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Description / Work Done
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-muted p-3 font-body-md text-foreground transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          placeholder="Document the specific steps taken, components replaced, or observations..."
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <label className="block px-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Attachments {requiresAttachments ? "(Required)" : "(Optional)"}
        </label>
        <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-8 transition-colors hover:bg-accent-green/10">
          <Camera className="mb-3 size-10 text-primary" />
          <label className="cursor-pointer">
            <p className="font-body-md text-muted-foreground">
              Drag images here or{" "}
              <span className="font-bold text-primary underline">
                browse files
              </span>
            </p>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
          <p className="mt-1 text-xs text-muted-foreground/60">
            PNG, JPG, PDF up to 10MB each
          </p>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground">
            Selected Files ({attachments.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {attachments.map((fileName) => (
              <div
                key={fileName}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs"
              >
                <span className="text-foreground">{fileName}</span>
                <button
                  type="button"
                  onClick={() => removeFile(fileName)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
