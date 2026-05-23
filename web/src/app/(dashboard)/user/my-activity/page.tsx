import { Lock, FileText, Clock } from "lucide-react"
import { getSessionAction } from "@/features/auth/server/actions/auth"
import { getTasksByUser } from "@/features/tasks/server/db/tasks"
import { TaskCard } from "./task-card"

export default async function MyActivityPage() {
  const session = await getSessionAction()
  let tasks: Awaited<ReturnType<typeof getTasksByUser>> = []

  if (session) {
    tasks = await getTasksByUser(session.sub)
  }

  const pendingTasks = tasks.filter((t) => t.status === "pending")
  const completedTasks = tasks.filter((t) => t.status === "completed")

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              My LOTO Activity
            </h2>
          </div>
          <p className="ml-4 text-sm text-muted-foreground">
            View your personal lockout/tagout statuses and history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Lock className="size-6" />
            </div>
            <h3 className="text-lg font-bold">Active Lockouts</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {pendingTasks.length > 0
              ? `You have ${pendingTasks.length} active lockout task${pendingTasks.length > 1 ? "s" : ""} pending.`
              : "You currently have no active lockouts."}
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-muted p-3 text-muted-foreground">
              <Clock className="size-6" />
            </div>
            <h3 className="text-lg font-bold">Task Summary</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {tasks.length > 0
              ? `${completedTasks.length} completed, ${pendingTasks.length} pending`
              : "No task records yet."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-accent-green/10 p-3 text-accent-green">
            <FileText className="size-5" />
          </div>
          <h3 className="text-xl font-bold">My Task Records</h3>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No task records yet. Submit your first task from a device card.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
