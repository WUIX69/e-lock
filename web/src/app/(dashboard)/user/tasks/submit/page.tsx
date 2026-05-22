import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { TaskForm } from "@/features/tasks/components/task-form"

export default async function TaskSubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ nodeId?: string }>
}) {
  const params = await searchParams

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

      <TaskForm defaultNodeId={params.nodeId || ""} />
    </div>
  )
}
