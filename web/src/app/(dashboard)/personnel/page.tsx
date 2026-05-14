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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-sidebar-accent rounded-full" />
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              Personnel & Clearances
            </h2>
          </div>
          <p className="text-sm text-muted-foreground ml-4">
            Authorization management for industrial isolation protocols and node access.
          </p>
        </div>
        
        <div className="flex items-center gap-3 ml-4 md:ml-0">
          <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-bold transition-colors hover:bg-muted">
            <Download className="size-4" />
            Export List
          </button>
          <button className="flex items-center gap-2 rounded-2xl bg-sidebar px-6 py-3 text-sm font-black uppercase tracking-widest text-sidebar-foreground shadow-lg transition-transform hover:scale-105 active:scale-95">
            <UserPlus className="size-4 text-sidebar-accent" />
            Enroll New Personnel
          </button>
        </div>
      </div>

      <PersonnelStats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
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
