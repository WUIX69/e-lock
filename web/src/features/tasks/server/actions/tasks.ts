"use server"

import { revalidatePath } from "next/cache"
import { submitTaskSchema, updateTaskSchema } from "@/features/tasks/schemas/tasks"
import {
  insertTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "@/features/tasks/server/db/tasks"
import { getSessionAction } from "@/features/auth/server/actions/auth"
import { AddTaskResult } from "@/types/tasks"

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
      coWorkerId: formData.get("coWorkerId") || undefined,
      coWorkerName: formData.get("coWorkerName") || undefined,
    }

    const parsed = submitTaskSchema.safeParse(raw)
    if (!parsed.success) {
      console.error("Task validation errors:", parsed.error.format())
      return { error: "Validation failed. Please check the form fields." }
    }

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
    if (!existing) {
      return { error: "Task not found." }
    }

    if (existing.userId !== session.sub) {
      return { error: "You can only update your own tasks." }
    }

    if (existing.status !== "pending") {
      return { error: "Only pending tasks can be updated." }
    }

    const raw = {
      id,
      deviceId: formData.get("deviceId") || existing.deviceId,
      taskType: formData.get("taskType") || existing.taskType,
      subject: formData.get("subject") || existing.subject,
      priority: formData.get("priority") || existing.priority,
      description: formData.get("description") || existing.description,
      coWorkerId: formData.get("coWorkerId") || existing.coWorkerId,
      coWorkerName: formData.get("coWorkerName") || existing.coWorkerName,
      status: formData.get("status") || undefined,
    }

    const parsed = updateTaskSchema.safeParse(raw)
    if (!parsed.success) {
      return { error: "Validation failed." }
    }

    await updateTask(id, {
      status: parsed.data.status,
      subject: parsed.data.subject,
      description: parsed.data.description ?? null,
    })

    revalidatePath("/user/my-activity")
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
    if (!session) {
      return { error: "You must be logged in." }
    }

    const id = formData.get("id") as string
    const existing = await getTaskById(id)
    if (!existing) {
      return { error: "Task not found." }
    }

    if (existing.userId !== session.sub) {
      return { error: "You can only cancel your own tasks." }
    }

    if (existing.status !== "pending") {
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
    if (!session) {
      return { error: "You must be logged in." }
    }

    const id = formData.get("id") as string
    const existing = await getTaskById(id)
    if (!existing) {
      return { error: "Task not found." }
    }

    if (session.role !== "admin" && existing.userId !== session.sub) {
      return { error: "Unauthorized." }
    }

    await deleteTask(id)

    revalidatePath("/admin/tasks")
    revalidatePath("/user/my-activity")
    return { success: true }
  } catch (error) {
    console.error("Delete task error:", error)
    return { error: "An unexpected error occurred." }
  }
}
