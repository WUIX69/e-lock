"use server"

import {
  addPersonnelSchema,
  editPersonnelSchema,
} from "@/features/personnel/schemas/personnel"
import {
  getUserByEmail,
  insertPersonnel,
  updatePersonnel,
  getAllPersonnel,
} from "@/features/personnel/server/db/personnel"
import { AddPersonnelResult } from "@/types/personnel"
import {
  setEnrollment,
  getEnrollment,
  deleteEnrollment,
  getNextAvailableId,
} from "@/features/personnel/server/enrollments"
import { publishMqtt } from "@/lib/mqtt-server"

export async function addPersonnelAction(
  formData: FormData
): Promise<AddPersonnelResult> {
  try {
    const data = {
      employeeId: formData.get("employeeId"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      role: formData.get("role"),
      position: formData.get("position"),
      securityLevel: formData.get("securityLevel"),
      status: formData.get("status"),
      pin: formData.get("pin"),
      fingerprintId: formData.get("fingerprintId"),
    }

    const validatedData = addPersonnelSchema.safeParse(data)

    if (!validatedData.success) {
      console.error("Zod Validation Errors:", validatedData.error.format())
      return {
        error: "Validation failed. Please check the form fields.",
      }
    }

    const existingUser = await getUserByEmail(validatedData.data.email)

    if (existingUser) {
      return {
        error: "A user with this email address is already registered.",
      }
    }

    await insertPersonnel(validatedData.data)

    return { success: true, fingerprintId: validatedData.data.fingerprintId ?? undefined }
  } catch (error) {
    console.error("Add personnel error:", error)
    return { error: "An unexpected error occurred while adding personnel." }
  }
}

export async function editPersonnelAction(
  formData: FormData
): Promise<AddPersonnelResult> {
  try {
    const id = formData.get("id") as string
    const data = {
      id,
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      role: formData.get("role"),
      position: formData.get("position"),
      securityLevel: formData.get("securityLevel"),
      status: formData.get("status"),
      pin: formData.get("pin"),
      fingerprintId: formData.get("fingerprintId"),
    }

    const validatedData = editPersonnelSchema.safeParse(data)

    if (!validatedData.success) {
      console.error("Zod Edit Validation Errors:", validatedData.error.format())
      return {
        error: "Validation failed. Please check the form fields.",
      }
    }

    const { id: validatedId, ...updateFields } = validatedData.data

    const existingUser = await getUserByEmail(updateFields.email)
    if (existingUser && existingUser.id !== validatedId) {
      return {
        error: "A user with this email address is already registered.",
      }
    }

    await updatePersonnel(validatedId, updateFields)

    return { success: true }
  } catch (error) {
    console.error("Edit personnel error:", error)
    return { error: "An unexpected error occurred while updating personnel." }
  }
}

export async function requestEnrollmentAction() {
  try {
    const allPersonnel = await getAllPersonnel()
    const usedIds = allPersonnel
      .map((p) => p.fingerprintId)
      .filter((id): id is number => id !== null)

    const nextId = getNextAvailableId(usedIds)
    if (nextId === -1) {
      return { error: "No available fingerprint IDs (max 162)" }
    }

    setEnrollment(nextId)
    publishMqtt("elock/command", { action: "enroll", id: nextId })

    return { success: true, fingerprintId: nextId }
  } catch (error) {
    console.error("Request enrollment error:", error)
    return { error: "Failed to initiate enrollment" }
  }
}

export async function checkEnrollmentStatusAction(fingerprintId: number) {
  try {
    const enrollment = getEnrollment(fingerprintId)
    if (!enrollment) {
      return { status: "expired" as const }
    }
    return { status: enrollment.status }
  } catch {
    return { status: "expired" as const }
  }
}

export async function cancelEnrollmentAction(fingerprintId: number) {
  try {
    deleteEnrollment(fingerprintId)
    publishMqtt("elock/command", { action: "cancel", id: fingerprintId })
    return { success: true }
  } catch {
    return { error: "Failed to cancel enrollment" }
  }
}
