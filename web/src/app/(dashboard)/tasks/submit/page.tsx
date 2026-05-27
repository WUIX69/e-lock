import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { TaskForm } from "@/features/tasks/components/task-form"
import { getAllDevices } from "@/features/devices/server/db/devices"
import { getAllActivePersonnel } from "@/features/personnel/server/db/personnel"
import { Device } from "@/types/devices"
import { CoWorker } from "@/types/tasks"

export default async function TaskSubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ deviceId?: string; taskId?: string }>
}) {
  const params = await searchParams
  const dbDevices = await getAllDevices()
  const personnel = await getAllActivePersonnel()

  const devices: Device[] = dbDevices.map((d) => ({
    id: d.id,
    deviceId: d.deviceId,
    type: d.type,
    assignedMachine: d.assignedMachine,
    signalStrength: d.signalStrength ?? 0,
    lastHeartbeat: "Unknown",
    status: d.status,
  }))

  const coworkers: CoWorker[] = personnel.map((u) => ({
    id: u.id,
    name: u.name,
    role: u.position,
    employeeId: u.employeeId,
  }))

  const isEditing = !!params.taskId

  return (
    <div className="mx-auto space-y-8 pb-12">
      <div className="mb-8">
        <nav className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-wider text-muted-foreground uppercase">
          <Link href="/" className="transition-colors hover:text-primary">
            Dashboard
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-primary">
            {isEditing ? "Edit Task Record" : "Task Submission"}
          </span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
          <h2 className="text-3xl font-black tracking-tighter text-foreground">
            {isEditing ? "Edit Task Record" : "Submit Task Record"}
          </h2>
        </div>
        <p className="mt-1 ml-4 text-sm text-muted-foreground">
          {isEditing
            ? "Update your pending maintenance task."
            : "Complete all steps to securely log industrial maintenance actions."}
        </p>
      </div>

      <TaskForm
        defaultDeviceId={params.deviceId || ""}
        devices={devices}
        coworkers={coworkers}
        taskId={params.taskId}
      />
    </div>
  )
}
