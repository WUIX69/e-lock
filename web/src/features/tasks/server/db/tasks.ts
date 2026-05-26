import { db } from "@/drizzle/db"
import {
  TaskTable,
  TaskCoWorkerTable,
  DeviceTable,
  UserTable,
  AttachmentTable,
} from "@/drizzle/schema"
import { eq, desc, inArray, and } from "drizzle-orm"
import { z } from "zod"
import { submitTaskSchema } from "@/features/tasks/schemas/tasks"

type SubmitTaskData = z.infer<typeof submitTaskSchema>

export async function insertTask(
  data: SubmitTaskData,
  userId: string,
  attachmentRecords?: { fileName: string; filePath: string }[]
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

  if (attachmentRecords && attachmentRecords.length > 0) {
    await db.insert(AttachmentTable).values(
      attachmentRecords.map((r) => ({
        fileName: r.fileName,
        filePath: r.filePath,
        referenceId: newTask.id,
        referenceModel: "tasks",
        category: "submission",
        uploadedById: userId,
      }))
    )
  }

  return newTask
}

type AttachmentRow = {
  id: string
  fileName: string
  filePath: string
  referenceId: string
  referenceModel: string
  category: string
  uploadedById: string
  uploadedAt: Date
}

async function getTaskAttachments(taskId: string): Promise<{
  submissionAttachments: AttachmentRow[]
  completionAttachments: AttachmentRow[]
}> {
  const attachments = await db
    .select()
    .from(AttachmentTable)
    .where(
      and(
        eq(AttachmentTable.referenceId, taskId),
        eq(AttachmentTable.referenceModel, "tasks")
      )
    )

  return {
    submissionAttachments: attachments.filter((a) => a.category === "submission"),
    completionAttachments: attachments.filter((a) => a.category === "completion"),
  }
}

export async function insertSubmissionAttachments(
  taskId: string,
  records: { fileName: string; filePath: string }[],
  userId: string
) {
  if (records.length === 0) return
  await db.insert(AttachmentTable).values(
    records.map((r) => ({
      fileName: r.fileName,
      filePath: r.filePath,
      referenceId: taskId,
      referenceModel: "tasks",
      category: "submission",
      uploadedById: userId,
    }))
  )
}

export async function insertCompletionAttachments(
  taskId: string,
  records: { fileName: string; filePath: string }[],
  userId: string
) {
  if (records.length === 0) return
  await db.insert(AttachmentTable).values(
    records.map((r) => ({
      fileName: r.fileName,
      filePath: r.filePath,
      referenceId: taskId,
      referenceModel: "tasks",
      category: "completion",
      uploadedById: userId,
    }))
  )
}

export async function getTaskById(id: string) {
  const [task] = await db
    .select()
    .from(TaskTable)
    .where(eq(TaskTable.id, id))
    .limit(1)

  if (!task) return null

  const [coWorkers, attachments] = await Promise.all([
    db
      .select({
        id: TaskCoWorkerTable.userId,
        name: TaskCoWorkerTable.name,
      })
      .from(TaskCoWorkerTable)
      .where(eq(TaskCoWorkerTable.taskId, id)),
    getTaskAttachments(id),
  ])

  return { ...task, coWorkers, ...attachments }
}

export async function getTasksByUser(userId: string) {
  const tasks = await db
    .select({
      id: TaskTable.id,
      deviceId: TaskTable.deviceId,
      deviceName: DeviceTable.assignedMachine,
      deviceLabel: DeviceTable.deviceId,
      deviceType: DeviceTable.type,
      userId: TaskTable.userId,
      userName: UserTable.name,
      userPosition: UserTable.position,
      taskType: TaskTable.taskType,
      subject: TaskTable.subject,
      priority: TaskTable.priority,
      description: TaskTable.description,
      status: TaskTable.status,
      approvedByAdmin: TaskTable.approvedByAdmin,
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
  const [allCoWorkers, allAttachments] = await Promise.all([
    db
      .select()
      .from(TaskCoWorkerTable)
      .where(inArray(TaskCoWorkerTable.taskId, taskIds)),
    db
      .select()
      .from(AttachmentTable)
      .where(
        and(
          inArray(AttachmentTable.referenceId, taskIds),
          eq(AttachmentTable.referenceModel, "tasks")
        )
      ),
  ])

  const coWorkerMap: Record<string, { id: string | null; name: string }[]> = {}
  for (const cw of allCoWorkers) {
    if (!coWorkerMap[cw.taskId]) coWorkerMap[cw.taskId] = []
    coWorkerMap[cw.taskId].push({ id: cw.userId, name: cw.name })
  }

  const attachmentMap: Record<
    string,
    { submissionAttachments: AttachmentRow[]; completionAttachments: AttachmentRow[] }
  > = {}
  for (const a of allAttachments) {
    if (!attachmentMap[a.referenceId]) {
      attachmentMap[a.referenceId] = { submissionAttachments: [], completionAttachments: [] }
    }
    if (a.category === "submission") {
      attachmentMap[a.referenceId].submissionAttachments.push(a)
    } else {
      attachmentMap[a.referenceId].completionAttachments.push(a)
    }
  }

  return tasks.map((t) => ({
    ...t,
    coWorkers: coWorkerMap[t.id] || [],
    submissionAttachments: attachmentMap[t.id]?.submissionAttachments || [],
    completionAttachments: attachmentMap[t.id]?.completionAttachments || [],
  }))
}

export async function getTasksByDevice(deviceId: string) {
  const tasks = await db
    .select({
      id: TaskTable.id,
      deviceId: TaskTable.deviceId,
      deviceName: DeviceTable.assignedMachine,
      deviceLabel: DeviceTable.deviceId,
      deviceType: DeviceTable.type,
      userId: TaskTable.userId,
      userName: UserTable.name,
      userPosition: UserTable.position,
      taskType: TaskTable.taskType,
      subject: TaskTable.subject,
      priority: TaskTable.priority,
      description: TaskTable.description,
      status: TaskTable.status,
      approvedByAdmin: TaskTable.approvedByAdmin,
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
  const [allCoWorkers, allAttachments] = await Promise.all([
    db
      .select()
      .from(TaskCoWorkerTable)
      .where(inArray(TaskCoWorkerTable.taskId, taskIds)),
    db
      .select()
      .from(AttachmentTable)
      .where(
        and(
          inArray(AttachmentTable.referenceId, taskIds),
          eq(AttachmentTable.referenceModel, "tasks")
        )
      ),
  ])

  const coWorkerMap: Record<string, { id: string | null; name: string }[]> = {}
  for (const cw of allCoWorkers) {
    if (!coWorkerMap[cw.taskId]) coWorkerMap[cw.taskId] = []
    coWorkerMap[cw.taskId].push({ id: cw.userId, name: cw.name })
  }

  const attachmentMap: Record<
    string,
    { submissionAttachments: AttachmentRow[]; completionAttachments: AttachmentRow[] }
  > = {}
  for (const a of allAttachments) {
    if (!attachmentMap[a.referenceId]) {
      attachmentMap[a.referenceId] = { submissionAttachments: [], completionAttachments: [] }
    }
    if (a.category === "submission") {
      attachmentMap[a.referenceId].submissionAttachments.push(a)
    } else {
      attachmentMap[a.referenceId].completionAttachments.push(a)
    }
  }

  return tasks.map((t) => ({
    ...t,
    coWorkers: coWorkerMap[t.id] || [],
    submissionAttachments: attachmentMap[t.id]?.submissionAttachments || [],
    completionAttachments: attachmentMap[t.id]?.completionAttachments || [],
  }))
}

export async function getAllTasks() {
  const tasks = await db
    .select({
      id: TaskTable.id,
      deviceId: TaskTable.deviceId,
      deviceName: DeviceTable.assignedMachine,
      deviceLabel: DeviceTable.deviceId,
      deviceType: DeviceTable.type,
      userId: TaskTable.userId,
      userName: UserTable.name,
      userPosition: UserTable.position,
      taskType: TaskTable.taskType,
      subject: TaskTable.subject,
      priority: TaskTable.priority,
      description: TaskTable.description,
      status: TaskTable.status,
      approvedByAdmin: TaskTable.approvedByAdmin,
      submittedAt: TaskTable.submittedAt,
      updatedAt: TaskTable.updatedAt,
    })
    .from(TaskTable)
    .leftJoin(DeviceTable, eq(TaskTable.deviceId, DeviceTable.id))
    .leftJoin(UserTable, eq(TaskTable.userId, UserTable.id))
    .orderBy(desc(TaskTable.submittedAt))

  if (tasks.length === 0) return []

  const taskIds = tasks.map((t) => t.id)
  const [allCoWorkers, allAttachments] = await Promise.all([
    db
      .select()
      .from(TaskCoWorkerTable)
      .where(inArray(TaskCoWorkerTable.taskId, taskIds)),
    db
      .select()
      .from(AttachmentTable)
      .where(
        and(
          inArray(AttachmentTable.referenceId, taskIds),
          eq(AttachmentTable.referenceModel, "tasks")
        )
      ),
  ])

  const coWorkerMap: Record<string, { id: string | null; name: string }[]> = {}
  for (const cw of allCoWorkers) {
    if (!coWorkerMap[cw.taskId]) coWorkerMap[cw.taskId] = []
    coWorkerMap[cw.taskId].push({ id: cw.userId, name: cw.name })
  }

  const attachmentMap: Record<
    string,
    { submissionAttachments: AttachmentRow[]; completionAttachments: AttachmentRow[] }
  > = {}
  for (const a of allAttachments) {
    if (!attachmentMap[a.referenceId]) {
      attachmentMap[a.referenceId] = { submissionAttachments: [], completionAttachments: [] }
    }
    if (a.category === "submission") {
      attachmentMap[a.referenceId].submissionAttachments.push(a)
    } else {
      attachmentMap[a.referenceId].completionAttachments.push(a)
    }
  }

  return tasks.map((t) => ({
    ...t,
    coWorkers: coWorkerMap[t.id] || [],
    submissionAttachments: attachmentMap[t.id]?.submissionAttachments || [],
    completionAttachments: attachmentMap[t.id]?.completionAttachments || [],
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
    approvedByAdmin: boolean
  }>
) {
  const [updated] = await db
    .update(TaskTable)
    .set(data)
    .where(eq(TaskTable.id, id))
    .returning()

  return updated
}

export async function updateTaskApproval(id: string, approved: boolean) {
  const [updated] = await db
    .update(TaskTable)
    .set({ approvedByAdmin: approved })
    .where(eq(TaskTable.id, id))
    .returning()

  return updated
}

export async function completeTaskWithAttachments(
  id: string,
  records: { fileName: string; filePath: string }[],
  userId: string
) {
  const [updated] = await db
    .update(TaskTable)
    .set({ status: "completed" })
    .where(eq(TaskTable.id, id))
    .returning()

  if (records.length > 0) {
    await db.insert(AttachmentTable).values(
      records.map((r) => ({
        fileName: r.fileName,
        filePath: r.filePath,
        referenceId: id,
        referenceModel: "tasks",
        category: "completion",
        uploadedById: userId,
      }))
    )
  }

  return updated
}

export async function deleteTask(id: string) {
  await db.delete(TaskTable).where(eq(TaskTable.id, id))
}
