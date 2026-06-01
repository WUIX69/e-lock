"use server"

import { db } from "@/drizzle/db"
import { DeviceTable, TaskTable, UserTable } from "@/drizzle/schema"
import { getSessionAction } from "@/features/auth/server/actions/auth"
import { sql } from "drizzle-orm"

export async function getAdminDashboardStatsAction() {
  try {
    const session = await getSessionAction()
    if (!session || session.role !== "admin") {
      return { error: "Unauthorized" }
    }

    const [deviceRows, taskRows, userRows] = await Promise.all([
      db
        .select({
          total: sql<number>`count(*)`,
          active: sql<number>`count(*) filter (where ${DeviceTable.status} = 'active')`,
          warning: sql<number>`count(*) filter (where ${DeviceTable.status} = 'warning')`,
          offline: sql<number>`count(*) filter (where ${DeviceTable.status} = 'offline')`,
          maintenance: sql<number>`count(*) filter (where ${DeviceTable.status} = 'maintenance')`,
        })
        .from(DeviceTable),
      db
        .select({
          total: sql<number>`count(*)`,
          pending: sql<number>`count(*) filter (where ${TaskTable.status} = 'pending')`,
          completed: sql<number>`count(*) filter (where ${TaskTable.status} = 'completed')`,
          denied: sql<number>`count(*) filter (where ${TaskTable.status} = 'denied')`,
          cancelled: sql<number>`count(*) filter (where ${TaskTable.status} = 'cancelled')`,
          relayFaults: sql<number>`count(*) filter (where ${TaskTable.relayFault} = true)`,
        })
        .from(TaskTable),
      db
        .select({
          total: sql<number>`count(*)`,
          admins: sql<number>`count(*) filter (where ${UserTable.role} = 'admin')`,
          users: sql<number>`count(*) filter (where ${UserTable.role} = 'user')`,
          active: sql<number>`count(*) filter (where ${UserTable.status} = 'active')`,
        })
        .from(UserTable),
    ])

    const device = deviceRows[0]
    const task = taskRows[0]
    const user = userRows[0]

    return {
      devices: {
        total: Number(device.total),
        active: Number(device.active),
        warning: Number(device.warning),
        offline: Number(device.offline),
        maintenance: Number(device.maintenance),
      },
      tasks: {
        total: Number(task.total),
        pending: Number(task.pending),
        completed: Number(task.completed),
        denied: Number(task.denied),
        cancelled: Number(task.cancelled),
        relayFaults: Number(task.relayFaults),
      },
      personnel: {
        total: Number(user.total),
        admins: Number(user.admins),
        users: Number(user.users),
        active: Number(user.active),
      },
    }
  } catch (error) {
    console.error("getAdminDashboardStatsAction error:", error)
    return { error: "Failed to load dashboard stats" }
  }
}
