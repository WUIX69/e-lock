import { Metadata } from "next"
import { PersonnelTable } from "@/features/personnel/components/personnel-table"
import { PersonnelStats } from "@/features/personnel/components/personnel-stats"
import { AccessControlPanel } from "@/features/personnel/components/access-control-panel"
import { UserPlus, Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Personnel | E-LOCK Management",
  description: "Manage facility personnel and biometric access clearance",
}

export default function PersonnelPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-sidebar-accent" />
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              Personnel & Clearances
            </h2>
          </div>
          <p className="ml-4 text-sm text-muted-foreground">
            Authorization management for industrial isolation protocols and node
            access.
          </p>
        </div>

        <div className="ml-4 flex items-center gap-3 md:ml-0">
          <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-bold transition-colors hover:bg-muted">
            <Download className="size-4" />
            Export List
          </button>
          <button className="flex items-center gap-2 rounded-2xl bg-sidebar px-6 py-3 text-sm font-black tracking-widest text-sidebar-foreground uppercase shadow-lg transition-transform hover:scale-105 active:scale-95">
            <UserPlus className="size-4 text-sidebar-accent" />
            Enroll New Personnel
          </button>
        </div>
      </div>

      <PersonnelStats />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PersonnelTable />
        </div>
        <div>
          <AccessControlPanel />
        </div>
      </div>
    </div>
  )
}
