"use server"

import { revalidatePath } from "next/cache"
import { submitTaskSchema, updateTaskSchema } from "@/features/tasks/schemas/tasks"
import {
  insertTask,
  getTaskById,
  updateTask,
  updateTaskCoworkers,
  deleteTask,
  getAllTasks,
} from "@/features/tasks/server/db/tasks"
import { getDeviceById } from "@/features/devices/server/db/devices"
import { getSessionAction } from "@/features/auth/server/actions/auth"
import { AddTaskResult } from "@/types/tasks"

const RESTRICTED_DEVICE_STATUSES = ["offline", "maintenance"]

function canBypassDeviceRestriction(role: string): boolean {
  return role === "admin" || role === "senior_engineer"
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

    await insertTask(parsed.data, session.sub)

    revalidatePath("/user/my-activity")
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
      coWorkerIds: JSON.parse(
        (formData.get("coWorkerIds") as string) || "[]"
      ),
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

    revalidatePath("/user/my-activity")
    revalidatePath("/tasks")
    return { success: true }
  } catch (error) {
    console.error("Update task error:", error)
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
