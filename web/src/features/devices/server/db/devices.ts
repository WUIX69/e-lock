import { db } from "@/drizzle/db"
import { DeviceTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { AddDeviceSchema } from "@/features/devices/schemas/devices"
import { DeviceStatus } from "@/types/devices"

export async function getDeviceByDeviceId(deviceId: string) {
  const devices = await db
    .select()
    .from(DeviceTable)
    .where(eq(DeviceTable.deviceId, deviceId))
    .limit(1)
  return devices[0] || null
}

export async function getDeviceByMacAddress(macAddress: string) {
  const devices = await db
    .select()
    .from(DeviceTable)
    .where(eq(DeviceTable.macAddress, macAddress))
    .limit(1)
  return devices[0] || null
}

export async function insertDevice(data: AddDeviceSchema) {
  const [newDevice] = await db
    .insert(DeviceTable)
    .values({
      deviceId: data.deviceId,
      type: data.hardwareType,
      assignedMachine: data.assignedMachine,
      macAddress: data.macAddress,
      isHighPriority: data.isHighPriority,
      signalStrength: 0,
      status: "active" as DeviceStatus,
      lastHeartbeatAt: new Date(),
    })
    .returning()

  return newDevice
}

export async function getAllDevices() {
  return await db.select().from(DeviceTable).orderBy(DeviceTable.createdAt)
}
