import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { UserTable, DeviceTable, TaskTable, AuditLogTable } from "@/drizzle/schema"
import * as bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("DATABASE_URL is not set")
  process.exit(1)
}

const client = postgres(connectionString)
const db = drizzle(client)

const devices = [
  {
    deviceId: "DEV-FC01",
    type: "field_controller" as const,
    deviceUniqueName: "Circuit Breaker Panel A",
    macAddress: "08:3A:F2:82:55:B8",
    isHighPriority: true,
    signalStrength: -48,
    lastHeartbeatAt: new Date(),
    status: "active" as const,
  },
  {
    deviceId: "DEV-FC02",
    type: "field_controller" as const,
    deviceUniqueName: "Circuit Breaker Panel B",
    macAddress: "28:05:A5:2F:CF:AC",
    isHighPriority: true,
    signalStrength: -55,
    lastHeartbeatAt: new Date(),
    status: "active" as const,
  },
  {
    deviceId: "GTWY-01",
    type: "gateway" as const,
    deviceUniqueName: "Central Gateway",
    macAddress: "A1:B2:C3:D4:E5:F3",
    isHighPriority: true,
    signalStrength: 0,
    lastHeartbeatAt: new Date(),
    status: "active" as const,
  },
]

async function seed() {
  console.log("Seeding database...")

  const adminPasswordHash = await bcrypt.hash("1234", 10)
  const userPasswordHash = await bcrypt.hash("5678", 10)

  const users = [
    {
      name: "Sarah Jenkins",
      email: "admin@elock.dev",
      passwordHash: adminPasswordHash,
      role: "admin" as const,
      employeeId: "AD104",
      position: "SYSTEM ADMIN",
      securityLevel: 5,
      status: "active" as const,
      fingerprintId: 2,
    },
    {
      name: "Maria Rodriguez",
      email: "admin2@elock.dev",
      passwordHash: adminPasswordHash,
      role: "admin" as const,
      employeeId: "AD102",
      position: "SAFETY SUPERVISOR",
      securityLevel: 5,
      status: "active" as const,
    },
    {
      name: "Alex Thompson",
      email: "user@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
      employeeId: "AC101",
      position: "SENIOR ELECTRICIAN",
      securityLevel: 4,
      status: "active" as const,
      fingerprintId: 1,
    },
    {
      name: "Ken Chen",
      email: "user2@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
      employeeId: "AC103",
      position: "MAINTENANCE ENGINEER",
      securityLevel: 3,
      status: "off-site" as const,
    },
    {
      name: "Robert Miller",
      email: "user3@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
      employeeId: "AC105",
      position: "JUNIOR TECHNICIAN",
      securityLevel: 2,
      status: "active" as const,
    },
  ]

  try {
    await db.delete(AuditLogTable)
    await db.delete(TaskTable)
    await db.delete(DeviceTable)
    await db.delete(UserTable)

    for (const user of users) {
      await db.insert(UserTable).values(user)
    }
    console.log(`Seeded ${users.length} users`)

    for (const device of devices) {
      await db.insert(DeviceTable).values(device)
    }
    console.log(`Seeded ${devices.length} devices`)

    console.log("Seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.end()
  }
}

seed()
