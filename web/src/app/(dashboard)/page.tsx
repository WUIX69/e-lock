import { Metadata } from "next"
import { RealtimeStats } from "@/features/dashboard/components/realtime-stats"
import { RecentActivity } from "@/features/dashboard/components/recent-activity"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Dashboard | E-LOCK Management",
  description: "E-LOCK Management Portal Dashboard overview",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <RealtimeStats />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {/* HACK: Placeholder for an actual chart component later */}
                <div className="mx-4 mb-4 flex h-[350px] items-center justify-center rounded-xl border-2 border-dashed text-muted-foreground">
                  Activity Chart Placeholder
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  You have 1,234 access events today.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed analytics will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="mx-6 mb-6 flex h-[400px] items-center justify-center rounded-xl border-2 border-dashed">
              <span className="text-muted-foreground">
                Analytics under construction
              </span>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download reports.</CardDescription>
            </CardHeader>
            <CardContent className="mx-6 mb-6 flex h-[400px] items-center justify-center rounded-xl border-2 border-dashed">
              <span className="text-muted-foreground">
                Reports under construction
              </span>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
