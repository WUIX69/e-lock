"use server"

import { addDeviceSchema } from "@/features/devices/schemas/devices"
import {
  getDeviceByDeviceId,
  getDeviceByMacAddress,
  insertDevice,
} from "@/features/devices/server/db/devices"
import { AddDeviceResult } from "@/types/devices"
import { revalidatePath } from "next/cache"

export async function addDeviceAction(
  formData: FormData
): Promise<AddDeviceResult> {
  try {
    const rawHardwareType = formData.get("hardwareType") as string
    const dbType =
      rawHardwareType === "controller" ? "field_controller" : rawHardwareType

    const data = {
      deviceId: formData.get("deviceId"),
      hardwareType: dbType,
      assignedMachine: formData.get("assignedMachine"),
      macAddress: formData.get("macAddress"),
      isHighPriority: formData.get("espNowPriority") === "high",
    }

    const validatedData = addDeviceSchema.safeParse(data)

    if (!validatedData.success) {
      console.error("Zod Validation Errors:", validatedData.error.format())
      return {
        error: "Validation failed. Please check the form fields.",
      }
    }

    const existingDeviceId = await getDeviceByDeviceId(
      validatedData.data.deviceId
    )
    if (existingDeviceId) {
      return {
        error: "A device with this ID is already registered.",
      }
    }

    const existingMac = await getDeviceByMacAddress(
      validatedData.data.macAddress
    )
    if (existingMac) {
      return {
        error: "A device with this MAC address is already registered.",
      }
    }

    await insertDevice(validatedData.data)

    revalidatePath("/devices")

    return { success: true }
  } catch (error) {
    console.error("Add device error:", error)
    return {
      error: "An unexpected error occurred while registering the device.",
    }
  }
}
