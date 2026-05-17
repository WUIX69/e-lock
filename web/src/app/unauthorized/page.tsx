import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col items-center text-center space-y-6 rounded-3xl border border-border bg-card p-12 shadow-2xl">
        <div className="rounded-2xl bg-destructive/10 p-4">
          <ShieldAlert className="size-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You do not have the required clearance level to access this sector of the management portal.
          </p>
        </div>
        <Link 
          href="/"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
