import { Metadata } from "next"
import { FileText } from "lucide-react"
import { getAllTasks } from "@/features/tasks/server/db/tasks"
import { AdminTasksTable } from "./admin-tasks-table"

export const metadata: Metadata = {
  title: "Task Records | E-LOCK Management",
  description: "View and manage all maintenance task records",
}

const AdminTasksPage = async () => {
  const tasks = await getAllTasks()

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground">
            Task Records
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all maintenance task records across devices.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3">
        <FileText className="size-5 text-muted-foreground" />
        <span className="text-sm font-bold text-muted-foreground">
          {tasks.length} total task{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      <AdminTasksTable tasks={tasks} />
    </div>
  )
}

export default AdminTasksPage
