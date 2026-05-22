"use client"

import { Camera } from "lucide-react"
import { TaskPriority } from "@/types/tasks"

interface TaskDetailsProps {
  subject: string
  priority: TaskPriority
  description: string
  onSubjectChange: (value: string) => void
  onPriorityChange: (value: TaskPriority) => void
  onDescriptionChange: (value: string) => void
}

const priorities: TaskPriority[] = ["Routine", "High", "Critical"]

export const TaskDetails = ({
  subject,
  priority,
  description,
  onSubjectChange,
  onPriorityChange,
  onDescriptionChange,
}: TaskDetailsProps) => {
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
          Attachments (Lockout Verification Photos)
        </label>
        <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-8 transition-colors hover:bg-accent-green/10 group">
          <Camera className="mb-3 size-10 text-primary transition-transform group-hover:scale-110" />
          <p className="font-body-md text-muted-foreground">
            Drag images here or{" "}
            <span className="font-bold text-primary underline">browse files</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            PNG, JPG up to 10MB each
          </p>
        </div>
      </div>
    </div>
  )
}
