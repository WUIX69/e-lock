import { z } from "zod"

const DEVICE_TYPES = ["field_controller", "shunt_trip", "gateway"] as const

export const addDeviceSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
  hardwareType: z.enum(DEVICE_TYPES, {
    message: "Please select a hardware type",
  }),
  deviceUniqueName: z.string().min(1, "Device name is required"),
  macAddress: z
    .string()
    .regex(
      /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/,
      "MAC address must be in format A1:B2:C3:D4:E5:F6"
    ),
  isHighPriority: z.boolean().default(false),
})

export type AddDeviceSchema = z.infer<typeof addDeviceSchema>
