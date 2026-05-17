import { Lock, History } from "lucide-react"

export default function MyActivityPage() {
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
          <p className="text-sm text-muted-foreground">You currently have no active lockouts.</p>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-muted p-3 text-muted-foreground">
              <History className="size-6" />
            </div>
            <h3 className="text-lg font-bold">Recent History</h3>
          </div>
          <p className="text-sm text-muted-foreground">No recent LOTO activity recorded.</p>
        </div>
      </div>
    </div>
  )
}
