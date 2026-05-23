import { db } from "@/drizzle/db"
import { TaskTable, DeviceTable, UserTable } from "@/drizzle/schema"
import { eq, desc } from "drizzle-orm"
import { z } from "zod"
import { submitTaskSchema } from "@/features/tasks/schemas/tasks"

type SubmitTaskData = z.infer<typeof submitTaskSchema>

export async function insertTask(
  data: SubmitTaskData,
  userId: string
) {
  const [newTask] = await db
    .insert(TaskTable)
    .values({
      deviceId: data.deviceId,
      userId,
      taskType: data.taskType,
      subject: data.subject,
      priority: data.priority,
      description: data.description ?? null,
      coWorkerId: data.coWorkerId ?? null,
      coWorkerName: data.coWorkerName ?? null,
    })
    .returning()

  return newTask
}

export async function getTaskById(id: string) {
  const tasks = await db
    .select()
    .from(TaskTable)
    .where(eq(TaskTable.id, id))
    .limit(1)

  return tasks[0] || null
}

export async function getTasksByUser(userId: string) {
  return await db
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
      coWorkerId: TaskTable.coWorkerId,
      coWorkerName: TaskTable.coWorkerName,
      status: TaskTable.status,
      submittedAt: TaskTable.submittedAt,
      updatedAt: TaskTable.updatedAt,
    })
    .from(TaskTable)
    .leftJoin(DeviceTable, eq(TaskTable.deviceId, DeviceTable.id))
    .leftJoin(UserTable, eq(TaskTable.userId, UserTable.id))
    .where(eq(TaskTable.userId, userId))
    .orderBy(desc(TaskTable.submittedAt))
}

export async function getTasksByDevice(deviceId: string) {
  return await db
    .select()
    .from(TaskTable)
    .where(eq(TaskTable.deviceId, deviceId))
    .orderBy(desc(TaskTable.submittedAt))
}

export async function getAllTasks() {
  return await db
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
      coWorkerId: TaskTable.coWorkerId,
      coWorkerName: TaskTable.coWorkerName,
      status: TaskTable.status,
      submittedAt: TaskTable.submittedAt,
      updatedAt: TaskTable.updatedAt,
    })
    .from(TaskTable)
    .leftJoin(DeviceTable, eq(TaskTable.deviceId, DeviceTable.id))
    .leftJoin(UserTable, eq(TaskTable.userId, UserTable.id))
    .orderBy(desc(TaskTable.submittedAt))
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
