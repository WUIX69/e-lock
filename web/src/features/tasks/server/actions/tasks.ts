"use server"

import { revalidatePath } from "next/cache"
import {
  submitTaskSchema,
  updateTaskSchema,
} from "@/features/tasks/schemas/tasks"
import {
  insertTask,
  getTaskById,
  updateTask,
  updateTaskCoworkers,
  deleteTask,
  getAllTasks,
  getTasksByUser,
  updateTaskApproval,
  completeTaskWithAttachments,
  insertSubmissionAttachments,
  getPendingInvitationsForUser,
  updateTaskCoWorkerStatus,
} from "@/features/tasks/server/db/tasks"
import { getDeviceById } from "@/features/devices/server/db/devices"
import { getSessionAction } from "@/features/auth/server/actions/auth"
import { createNotification } from "@/features/notifications/server/db/notifications"
import { db } from "@/drizzle/db"
import { UserTable, AttachmentTable } from "@/drizzle/schema"
import { eq, inArray } from "drizzle-orm"
import { AddTaskResult } from "@/types/tasks"
import { storeFile, deleteStoredFile } from "@/lib/file-storage"
import { publishMqtt } from "@/lib/mqtt-server"

const RESTRICTED_DEVICE_STATUSES = ["offline", "maintenance"]
const STRICT_TASK_TYPES = ["Preventative Maintenance", "Emergency Repair"]

function canBypassDeviceRestriction(role: string): boolean {
  return role === "admin" || role === "senior_engineer"
}

function isStrictTask(taskType: string): boolean {
  return STRICT_TASK_TYPES.includes(taskType)
}

async function checkDeviceAccess(
  deviceId: string,
  userRole: string
): Promise<string | null> {
  const device = await getDeviceById(deviceId)
  if (!device) return "Device not found."

  if (RESTRICTED_DEVICE_STATUSES.includes(device.status)) {
    if (!canBypassDeviceRestriction(userRole)) {
      return `Cannot submit task: device is currently "${device.status}". Only Senior Engineers and Admins can submit tasks on restricted devices.`
    }
  }

  return null
}

export async function submitTaskAction(
  formData: FormData
): Promise<AddTaskResult> {
  try {
    const session = await getSessionAction()
    if (!session) {
      return { error: "You must be logged in to submit a task." }
    }

    const rawAttachments: string[] = JSON.parse(
      (formData.get("attachments") as string) || "[]"
    )

    const raw = {
      deviceId: formData.get("deviceId"),
      taskType: formData.get("taskType"),
      subject: formData.get("subject"),
      priority: formData.get("priority"),
      description: formData.get("description") || undefined,
      coWorkerIds: JSON.parse((formData.get("coWorkerIds") as string) || "[]"),
      coWorkerNames: JSON.parse(
        (formData.get("coWorkerNames") as string) || "[]"
      ),
      attachments: rawAttachments,
    }

    const parsed = submitTaskSchema.safeParse(raw)
    if (!parsed.success) {
      console.error("Task validation errors:", parsed.error.format())
      return { error: "Validation failed. Please check the form fields." }
    }

    const deviceError = await checkDeviceAccess(
      parsed.data.deviceId,
      session.role
    )
    if (deviceError) return { error: deviceError }

    const userSecurityLevel = session.securityLevel ?? 0

    if (userSecurityLevel < 4) {
      const allowedTypes = ["General Record / Log", "Safety Inspection"]
      if (!allowedTypes.includes(parsed.data.taskType)) {
        return {
          error:
            "Your security level does not allow submitting this task type.",
        }
      }
    }

    if (userSecurityLevel >= 4 && isStrictTask(parsed.data.taskType)) {
      if (parsed.data.attachments.length === 0) {
        return {
          error:
            "Attachments are required for this task type. Please upload at least one file.",
        }
      }
    }

    const files = formData.getAll("files") as File[]

    const attachmentRecords: { fileName: string; filePath: string }[] = []

    const newTask = await insertTask(parsed.data, session.sub, [])

    if (files.length > 0) {
      for (const file of files) {
        const storedPath = await storeFile("tasks", newTask.id, file)
        attachmentRecords.push({ fileName: file.name, filePath: storedPath })
      }
      await insertSubmissionAttachments(
        newTask.id,
        attachmentRecords,
        session.sub
      )
    }

    if (parsed.data.coWorkerIds.length > 0) {
      for (const coworkerId of parsed.data.coWorkerIds) {
        await createNotification({
          recipientId: coworkerId,
          title: "Invitation Request",
          description: `${session.name} has invited you to collaborate on task: ${parsed.data.subject}.`,
          category: "task_update",
          severity: "warning",
          actionLabel: "View Invitation",
          actorName: session.name,
        })
      }
    }

    const admins = await db
      .select({ id: UserTable.id })
      .from(UserTable)
      .where(eq(UserTable.role, "admin"))

    for (const admin of admins) {
      await createNotification({
        recipientId: admin.id,
        title: "Verification Needed",
        description: `${session.name} has submitted a new task: ${parsed.data.subject} which requires verification.`,
        category: "task_update",
        severity: "info",
        actionLabel: "Review Task",
        actorName: session.name,
      })
    }

    revalidatePath("/user/my-activity")
    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Submit task error:", error)
    return { error: "An unexpected error occurred while submitting the task." }
  }
}

export async function updateTaskAction(
  formData: FormData
): Promise<AddTaskResult> {
  try {
    const session = await getSessionAction()
    if (!session) {
      return { error: "You must be logged in." }
    }

    const id = formData.get("id") as string
    const existing = await getTaskById(id)
    if (!existing) return { error: "Task not found." }

    if (existing.userId !== session.sub && session.role !== "admin") {
      return { error: "You can only update your own tasks." }
    }

    if (existing.status !== "pending" && session.role !== "admin") {
      return { error: "Only pending tasks can be updated." }
    }

    const raw = {
      id,
      deviceId: formData.get("deviceId") || existing.deviceId,
      taskType: formData.get("taskType") || existing.taskType,
      subject: formData.get("subject") || existing.subject,
      priority: formData.get("priority") || existing.priority,
      description: formData.get("description") || existing.description,
      coWorkerIds: JSON.parse((formData.get("coWorkerIds") as string) || "[]"),
      coWorkerNames: JSON.parse(
        (formData.get("coWorkerNames") as string) || "[]"
      ),
      status: formData.get("status") || undefined,
    }

    const parsed = updateTaskSchema.safeParse(raw)
    if (!parsed.success) {
      console.error("Update validation errors:", parsed.error.format())
      return { error: "Validation failed." }
    }

    const deviceError = await checkDeviceAccess(
      parsed.data.deviceId,
      session.role
    )
    if (deviceError) return { error: deviceError }

    await updateTask(id, {
      status: parsed.data.status,
      subject: parsed.data.subject,
      description: parsed.data.description ?? null,
    })

    if (parsed.data.coWorkerIds.length > 0) {
      await updateTaskCoworkers(
        id,
        parsed.data.coWorkerIds,
        parsed.data.coWorkerNames
      )
    }

    const newFiles = formData.getAll("files") as File[]
    if (newFiles.length > 0) {
      const records: { fileName: string; filePath: string }[] = []
      for (const file of newFiles) {
        const storedPath = await storeFile("tasks", id, file)
        records.push({ fileName: file.name, filePath: storedPath })
      }
      await insertSubmissionAttachments(id, records, session.sub)
    }

    const deletedIds: string[] = JSON.parse(
      (formData.get("deletedAttachmentIds") as string) || "[]"
    )
    if (deletedIds.length > 0) {
      const records = await db
        .select({ filePath: AttachmentTable.filePath })
        .from(AttachmentTable)
        .where(inArray(AttachmentTable.id, deletedIds))

      for (const id of deletedIds) {
        await db.delete(AttachmentTable).where(eq(AttachmentTable.id, id))
      }

      for (const rec of records) {
        await deleteStoredFile(rec.filePath)
      }
    }

    revalidatePath("/user/my-activity")
    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Update task error:", error)
    return { error: "An unexpected error occurred." }
  }
}

export async function approveTaskAction(
  taskId: string
): Promise<AddTaskResult> {
  try {
    const session = await getSessionAction()
    if (!session) return { error: "You must be logged in." }

    if (session.role !== "admin") {
      return { error: "Only admins can approve tasks." }
    }

    const task = await getTaskById(taskId)
    if (!task) return { error: "Task not found." }

    if (task.status !== "pending") {
      return { error: "Only pending tasks can be approved." }
    }

    if (!isStrictTask(task.taskType)) {
      return { error: "Non-strict tasks do not require admin approval." }
    }

    await updateTaskApproval(taskId, true)

    const device = await getDeviceById(task.deviceId)
    if (device) {
      publishMqtt("elock/command", {
        action: "maintenance_on",
        deviceId: device.deviceId,
        issuedBy: session.sub,
        timestamp: Math.floor(Date.now() / 1000),
      })
    }

    await createNotification({
      recipientId: task.userId,
      title: "Task Approved",
      description: `Your task "${task.subject}" has been approved by ${session.name}. You may now mark it as complete.`,
      category: "task_update",
      severity: "info",
      actionLabel: "View Task",
      actorName: session.name,
    })

    revalidatePath("/user/my-activity")
    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Approve task error:", error)
    return { error: "An unexpected error occurred." }
  }
}

export async function denyTaskAction(taskId: string): Promise<AddTaskResult> {
  try {
    const session = await getSessionAction()
    if (!session) return { error: "You must be logged in." }

    if (session.role !== "admin") {
      return { error: "Only admins can deny tasks." }
    }

    const task = await getTaskById(taskId)
    if (!task) return { error: "Task not found." }

    if (task.status !== "pending") {
      return { error: "Only pending tasks can be denied." }
    }

    if (!isStrictTask(task.taskType)) {
      return { error: "Non-strict tasks do not require admin approval." }
    }

    await updateTask(taskId, { status: "denied" })

    await createNotification({
      recipientId: task.userId,
      title: "Task Denied",
      description: `Your task "${task.subject}" has been denied by ${session.name}. Please review and resubmit if needed.`,
      category: "task_update",
      severity: "warning",
      actionLabel: "View Task",
      actorName: session.name,
    })

    revalidatePath("/user/my-activity")
    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Deny task error:", error)
    return { error: "An unexpected error occurred." }
  }
}

export async function completeTaskAction(
  formData: FormData
): Promise<AddTaskResult> {
  try {
    const session = await getSessionAction()
    if (!session) return { error: "You must be logged in." }

    const taskId = formData.get("taskId") as string
    if (!taskId) return { error: "Task ID is required." }

    const fileNames: string[] = JSON.parse(
      (formData.get("fileNames") as string) || "[]"
    )

    const task = await getTaskById(taskId)
    if (!task) return { error: "Task not found." }

    if (task.userId !== session.sub && session.role !== "admin") {
      return { error: "You can only complete your own tasks." }
    }

    if (task.status !== "pending") {
      return { error: "Only pending tasks can be completed." }
    }

    const strict = isStrictTask(task.taskType)
    const userSecurityLevel = session.securityLevel ?? 0

    if (strict && userSecurityLevel >= 4) {
      if (!task.approvedByAdmin) {
        return {
          error:
            "This task must be approved by an admin before it can be marked as complete.",
        }
      }

      if (fileNames.length === 0) {
        return {
          error:
            "Completion attachments are required for this task type. Please upload at least one file.",
        }
      }
    }

    const files = formData.getAll("files") as File[]
    const attachmentRecords: { fileName: string; filePath: string }[] = []

    if (files.length > 0) {
      for (const file of files) {
        const storedPath = await storeFile("tasks", taskId, file)
        attachmentRecords.push({ fileName: file.name, filePath: storedPath })
      }
    }

    await completeTaskWithAttachments(taskId, attachmentRecords, session.sub)

    const completedDevice = await getDeviceById(task.deviceId)
    if (completedDevice) {
      publishMqtt("elock/command", {
        action: "maintenance_off",
        deviceId: completedDevice.deviceId,
        issuedBy: session.sub,
        timestamp: Math.floor(Date.now() / 1000),
      })
    }

    revalidatePath("/user/my-activity")
    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Complete task error:", error)
    return { error: "An unexpected error occurred." }
  }
}

export async function cancelTaskAction(
  formData: FormData
): Promise<AddTaskResult> {
  try {
    const session = await getSessionAction()
    if (!session) return { error: "You must be logged in." }

    const id = formData.get("id") as string
    const existing = await getTaskById(id)
    if (!existing) return { error: "Task not found." }

    if (existing.userId !== session.sub && session.role !== "admin") {
      return { error: "You can only cancel your own tasks." }
    }

    if (existing.status !== "pending" && session.role !== "admin") {
      return { error: "Only pending tasks can be cancelled." }
    }

    await updateTask(id, { status: "cancelled" })

    revalidatePath("/user/my-activity")
    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Cancel task error:", error)
    return { error: "An unexpected error occurred." }
  }
}

export async function deleteTaskAction(
  formData: FormData
): Promise<AddTaskResult> {
  try {
    const session = await getSessionAction()
    if (!session) return { error: "You must be logged in." }

    const id = formData.get("id") as string
    const existing = await getTaskById(id)
    if (!existing) return { error: "Task not found." }

    if (session.role !== "admin") {
      return { error: "Only admins can delete tasks." }
    }

    await deleteTask(id)

    revalidatePath("/tasks")
    revalidatePath("/user/my-activity")
    return { success: true }
  } catch (error) {
    console.error("Delete task error:", error)
    return { error: "An unexpected error occurred." }
  }
}

export async function getTaskForEditAction(
  taskId: string
): Promise<{ task?: Record<string, unknown>; error?: string }> {
  try {
    const session = await getSessionAction()
    if (!session) return { error: "You must be logged in." }

    const task = await getTaskById(taskId)
    if (!task) return { error: "Task not found." }

    if (task.userId !== session.sub && session.role !== "admin") {
      return { error: "Unauthorized." }
    }

    if (task.status !== "pending" && session.role !== "admin") {
      return { error: "Only pending tasks can be edited." }
    }

    return { task }
  } catch {
    return { error: "Failed to load task." }
  }
}

export async function getAllTasksAction() {
  try {
    const session = await getSessionAction()
    if (!session) return { error: "You must be logged in." }

    const tasks = await getAllTasks()
    return { tasks }
  } catch {
    return { error: "Failed to load tasks." }
  }
}

export async function getPendingInvitationsAction(): Promise<{
  invitations?: Array<{
    id: string
    taskId: string
    taskSubject: string
    taskType: string
    taskPriority: string
    taskDescription: string | null
    creatorName: string
    deviceName: string | null
    deviceLabel: string | null
    submittedAt: Date
  }>
  error?: string
}> {
  try {
    const session = await getSessionAction()
    if (!session) return { error: "You must be logged in." }

    const invitations = await getPendingInvitationsForUser(session.sub)
    return { invitations }
  } catch {
    return { error: "Failed to load invitations." }
  }
}

export async function respondToInvitationAction(
  taskId: string,
  accept: boolean
): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await getSessionAction()
    if (!session) return { error: "You must be logged in." }

    const newStatus = accept ? "accepted" : "declined"
    await updateTaskCoWorkerStatus(taskId, session.sub, newStatus)

    const task = await getTaskById(taskId)
    if (task) {
      const notificationTitle = accept
        ? "Invitation Accepted"
        : "Invitation Declined"
      const notificationDesc = accept
        ? `${session.name} has accepted your invitation to collaborate on task: ${task.subject}.`
        : `${session.name} has declined your invitation to collaborate on task: ${task.subject}.`

      await createNotification({
        recipientId: task.userId,
        title: notificationTitle,
        description: notificationDesc,
        category: "task_update",
        severity: accept ? "info" : "default",
        actionLabel: "View Task",
        actorName: session.name,
      })
    }

    revalidatePath("/user/my-activity")
    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Respond to invitation error:", error)
    return { error: "An unexpected error occurred." }
  }
}

export async function getMyTasksAction() {
  try {
    const session = await getSessionAction()
    if (!session) return { error: "You must be logged in." }

    const tasks = await getTasksByUser(session.sub)
    return { tasks }
  } catch {
    return { error: "Failed to load tasks." }
  }
}

export async function getUserTaskStatsAction() {
  try {
    const session = await getSessionAction()
    if (!session) {
      return {
        completedThisMonth: 0,
        pendingCount: 0,
        avgVerificationTime: 0,
        accuracyScore: 99.2,
        error: "You must be logged in.",
      }
    }

    const tasks = await getTasksByUser(session.sub)
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    const completedThisMonth = tasks.filter((t) => {
      if (t.status !== "completed") return false
      const d = new Date(t.submittedAt)
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    }).length

    const pendingCount = tasks.filter((t) => t.status === "pending").length

    const completedTimes = tasks
      .filter((t) => t.status === "completed")
      .map((t) => {
        const submitted = new Date(t.submittedAt).getTime()
        const updated = new Date(t.updatedAt).getTime()
        return (updated - submitted) / 60000
      })
    const avgTime =
      completedTimes.length > 0
        ? Math.round(
            completedTimes.reduce((a, b) => a + b, 0) / completedTimes.length
          )
        : 0

    return {
      completedThisMonth,
      pendingCount,
      avgVerificationTime: avgTime,
      accuracyScore: 99.2,
    }
  } catch {
    return {
      completedThisMonth: 0,
      pendingCount: 0,
      avgVerificationTime: 0,
      accuracyScore: 99.2,
      error: "Failed to load stats.",
    }
  }
}

export async function getAdminTaskStatsAction() {
  try {
    const session = await getSessionAction()
    if (!session) {
      return {
        totalSubmissions: 0,
        criticalRepairs: 0,
        pendingVerifications: 0,
        verificationRate: 0,
        growth: 0,
        error: "You must be logged in.",
      }
    }

    const tasks = await getAllTasks()
    const totalSubmissions = tasks.length
    const criticalRepairs = tasks.filter(
      (t) => t.priority === "Critical" && t.status === "pending"
    ).length
    const pendingVerifications = tasks.filter(
      (t) => t.status === "pending"
    ).length
    const verifiedCount = tasks.filter((t) => t.status === "completed").length
    const verificationRate =
      tasks.length > 0 ? Math.round((verifiedCount / tasks.length) * 100) : 0

    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const thisMonthCount = tasks.filter((t) => {
      const d = new Date(t.submittedAt)
      const now = new Date()
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      )
    }).length
    const lastMonthCount = tasks.filter((t) => {
      const d = new Date(t.submittedAt)
      return (
        d.getMonth() === lastMonth.getMonth() &&
        d.getFullYear() === lastMonth.getFullYear()
      )
    }).length
    const growth =
      lastMonthCount > 0
        ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
        : 12

    return {
      totalSubmissions,
      criticalRepairs,
      pendingVerifications,
      verificationRate,
      growth,
    }
  } catch {
    return {
      totalSubmissions: 0,
      criticalRepairs: 0,
      pendingVerifications: 0,
      verificationRate: 0,
      growth: 0,
      error: "Failed to load stats.",
    }
  }
}
