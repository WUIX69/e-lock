import { Metadata } from "next"
import { AuditTable } from "@/features/audit/components/audit-table"
import { AuditFilters } from "@/features/audit/components/audit-filters"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Audit Trail | E-LOCK Management",
  description: "View and filter system audit logs",
}

export default function AuditPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Audit Trail</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>
            Comprehensive record of all system events, access attempts, and
            configuration changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AuditFilters />
          <AuditTable />
        </CardContent>
      </Card>
    </div>
  )
}
