import { Metadata } from "next"
import { AuditTable } from "@/features/audit/components/audit-table"
import { AuditFilters } from "@/features/audit/components/audit-filters"
import { EventDistribution } from "@/features/audit/components/event-distribution"
import { ComplianceSummary } from "@/features/audit/components/compliance-summary"
import { FileText, Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Audit Trail | E-LOCK Management",
  description: "View system isolation logs and safety audit trails",
}

export default function AuditPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              Audit Trail & Safety Logs
            </h2>
          </div>
          <p className="text-sm text-muted-foreground ml-4">
            Real-time monitoring of facility isolation protocols and biometric
            access events.
          </p>
        </div>
        
        <div className="flex items-center gap-3 ml-4 md:ml-0">
          <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-bold transition-colors hover:bg-muted">
            <Download className="size-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95">
            <FileText className="size-4" />
            Generate Compliance Report
          </button>
        </div>
      </div>

      <AuditFilters />
      
      <AuditTable />

      {/* Insight Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EventDistribution />
        <ComplianceSummary />
      </div>
    </div>
  )
}
