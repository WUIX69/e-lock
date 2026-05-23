import { db } from "@/drizzle/db"
import {
  TaskTable,
  TaskCoWorkerTable,
  DeviceTable,
  UserTable,
} from "@/drizzle/schema"
import { eq, desc, inArray } from "drizzle-orm"
import { z } from "zod"
import { submitTaskSchema } from "@/features/tasks/schemas/tasks"

type SubmitTaskData = z.infer<typeof submitTaskSchema>

export async function insertTask(data: SubmitTaskData, userId: string) {
  const [newTask] = await db
    .insert(TaskTable)
    .values({
      deviceId: data.deviceId,
      userId,
      taskType: data.taskType,
      subject: data.subject,
      priority: data.priority,
      description: data.description ?? null,
    })
    .returning()

  if (data.coWorkerIds.length > 0) {
    await db.insert(TaskCoWorkerTable).values(
      data.coWorkerIds.map((cwId, i) => ({
        taskId: newTask.id,
        userId: cwId,
        name: data.coWorkerNames[i] || "",
      }))
    )
  }

  return newTask
}

export async function getTaskById(id: string) {
  const [task] = await db
    .select()
    .from(TaskTable)
    .where(eq(TaskTable.id, id))
    .limit(1)

  if (!task) return null

  const coWorkers = await db
    .select({
      id: TaskCoWorkerTable.userId,
      name: TaskCoWorkerTable.name,
    })
    .from(TaskCoWorkerTable)
    .where(eq(TaskCoWorkerTable.taskId, id))

  return { ...task, coWorkers }
}

export async function getTasksByUser(userId: string) {
  const tasks = await db
    .select({
      id: TaskTable.id,
      deviceId: TaskTable.deviceId,
      deviceName: DeviceTable.assignedMachine,
      deviceLabel: DeviceTable.deviceId,
      userId: TaskTable.userId,
      userName: UserTable.name,
      taskType: TaskTable.taskType,
      subject: TaskTable.subject,
      priority: TaskTable.priority,
      description: TaskTable.description,
      status: TaskTable.status,
      submittedAt: TaskTable.submittedAt,
      updatedAt: TaskTable.updatedAt,
    })
    .from(TaskTable)
    .leftJoin(DeviceTable, eq(TaskTable.deviceId, DeviceTable.id))
    .leftJoin(UserTable, eq(TaskTable.userId, UserTable.id))
    .where(eq(TaskTable.userId, userId))
    .orderBy(desc(TaskTable.submittedAt))

  if (tasks.length === 0) return []

  const taskIds = tasks.map((t) => t.id)
  const allCoWorkers = await db
    .select()
    .from(TaskCoWorkerTable)
    .where(inArray(TaskCoWorkerTable.taskId, taskIds))

  const coWorkerMap: Record<string, { id: string | null; name: string }[]> = {}
  for (const cw of allCoWorkers) {
    if (!coWorkerMap[cw.taskId]) coWorkerMap[cw.taskId] = []
    coWorkerMap[cw.taskId].push({ id: cw.userId, name: cw.name })
  }

  return tasks.map((t) => ({
    ...t,
    coWorkers: coWorkerMap[t.id] || [],
  }))
}

export async function getTasksByDevice(deviceId: string) {
  const tasks = await db
    .select({
      id: TaskTable.id,
      deviceId: TaskTable.deviceId,
      deviceName: DeviceTable.assignedMachine,
      deviceLabel: DeviceTable.deviceId,
      userId: TaskTable.userId,
      userName: UserTable.name,
      taskType: TaskTable.taskType,
      subject: TaskTable.subject,
      priority: TaskTable.priority,
      description: TaskTable.description,
      status: TaskTable.status,
      submittedAt: TaskTable.submittedAt,
      updatedAt: TaskTable.updatedAt,
    })
    .from(TaskTable)
    .leftJoin(DeviceTable, eq(TaskTable.deviceId, DeviceTable.id))
    .leftJoin(UserTable, eq(TaskTable.userId, UserTable.id))
    .where(eq(TaskTable.deviceId, deviceId))
    .orderBy(desc(TaskTable.submittedAt))

  if (tasks.length === 0) return []

  const taskIds = tasks.map((t) => t.id)
  const allCoWorkers = await db
    .select()
    .from(TaskCoWorkerTable)
    .where(inArray(TaskCoWorkerTable.taskId, taskIds))

  const coWorkerMap: Record<string, { id: string | null; name: string }[]> = {}
  for (const cw of allCoWorkers) {
    if (!coWorkerMap[cw.taskId]) coWorkerMap[cw.taskId] = []
    coWorkerMap[cw.taskId].push({ id: cw.userId, name: cw.name })
  }

  return tasks.map((t) => ({
    ...t,
    coWorkers: coWorkerMap[t.id] || [],
  }))
}

export async function getAllTasks() {
  const tasks = await db
    .select({
      id: TaskTable.id,
      deviceId: TaskTable.deviceId,
      deviceName: DeviceTable.assignedMachine,
      deviceLabel: DeviceTable.deviceId,
      userId: TaskTable.userId,
      userName: UserTable.name,
      taskType: TaskTable.taskType,
      subject: TaskTable.subject,
      priority: TaskTable.priority,
      description: TaskTable.description,
      status: TaskTable.status,
      submittedAt: TaskTable.submittedAt,
      updatedAt: TaskTable.updatedAt,
    })
    .from(TaskTable)
    .leftJoin(DeviceTable, eq(TaskTable.deviceId, DeviceTable.id))
    .leftJoin(UserTable, eq(TaskTable.userId, UserTable.id))
    .orderBy(desc(TaskTable.submittedAt))

  if (tasks.length === 0) return []

  const taskIds = tasks.map((t) => t.id)
  const allCoWorkers = await db
    .select()
    .from(TaskCoWorkerTable)
    .where(inArray(TaskCoWorkerTable.taskId, taskIds))

  const coWorkerMap: Record<string, { id: string | null; name: string }[]> = {}
  for (const cw of allCoWorkers) {
    if (!coWorkerMap[cw.taskId]) coWorkerMap[cw.taskId] = []
    coWorkerMap[cw.taskId].push({ id: cw.userId, name: cw.name })
  }

  return tasks.map((t) => ({
    ...t,
    coWorkers: coWorkerMap[t.id] || [],
  }))
}

export async function updateTaskCoworkers(
  taskId: string,
  coWorkerIds: string[],
  coWorkerNames: string[]
) {
  await db.delete(TaskCoWorkerTable).where(eq(TaskCoWorkerTable.taskId, taskId))

  if (coWorkerIds.length > 0) {
    await db.insert(TaskCoWorkerTable).values(
      coWorkerIds.map((cwId, i) => ({
        taskId,
        userId: cwId,
        name: coWorkerNames[i] || "",
      }))
    )
  }
}

export async function updateTask(
  id: string,
  data: Partial<{
    status: string
    subject: string
    description: string | null
  }>
) {
  const [updated] = await db
    .update(TaskTable)
    .set(data)
    .where(eq(TaskTable.id, id))
    .returning()

  return updated
}

export async function deleteTask(id: string) {
  await db.delete(TaskTable).where(eq(TaskTable.id, id))
}
