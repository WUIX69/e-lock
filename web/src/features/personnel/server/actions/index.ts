"use server"

import { addPersonnelSchema } from "../../schemas/add-personnel-schema"
import { getUserByEmail, insertPersonnel, updatePersonnel } from "../db"
import { AddPersonnelResult } from "@/types/personnel"

export async function addPersonnelAction(formData: FormData): Promise<AddPersonnelResult> {
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

    return { success: true }
  } catch (error) {
    console.error("Add personnel error:", error)
    return { error: "An unexpected error occurred while adding personnel." }
  }
}

export async function editPersonnelAction(formData: FormData): Promise<AddPersonnelResult> {
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
    }

    const validatedData = (await import("../../schemas/edit-personnel-schema")).editPersonnelSchema.safeParse(data)

    if (!validatedData.success) {
      console.error("Zod Edit Validation Errors:", validatedData.error.format())
      return { 
        error: "Validation failed. Please check the form fields.",
      }
    }

    const { id: validatedId, ...updateFields } = validatedData.data

    // Check if email belongs to another user
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
