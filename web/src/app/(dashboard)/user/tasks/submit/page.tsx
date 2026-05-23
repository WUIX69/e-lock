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
  searchParams: Promise<{ deviceId?: string }>
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

  return (
    <div className="mx-auto space-y-8 pb-12">
      <div className="mb-8">
        <nav className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-wider text-muted-foreground uppercase">
          <Link href="/" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-primary">Task Submission</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
          <h2 className="text-3xl font-black tracking-tighter text-foreground">
            Submit Task Record
          </h2>
        </div>
        <p className="ml-4 mt-1 text-sm text-muted-foreground">
          Complete all steps to securely log industrial maintenance actions.
        </p>
      </div>

      <TaskForm
        defaultDeviceId={params.deviceId || ""}
        devices={devices}
        coworkers={coworkers}
      />
    </div>
  )
}
