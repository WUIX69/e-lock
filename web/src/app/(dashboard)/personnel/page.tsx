import { Metadata } from "next"
import { PersonnelTable } from "@/features/personnel/components/personnel-table"
import { PersonnelActions } from "@/features/personnel/components/personnel-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Personnel Management | E-LOCK Management",
  description: "Manage system personnel, roles, and access levels",
}

export default function PersonnelPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Personnel Management
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personnel Directory</CardTitle>
          <CardDescription>
            Manage employee access credentials, roles, and facility permissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PersonnelActions />
          <PersonnelTable />
        </CardContent>
      </Card>
    </div>
  )
}
