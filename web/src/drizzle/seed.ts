import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { UserTable, DeviceTable } from "@/drizzle/schema"
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
    deviceId: "DEV-1001",
    type: "field_controller" as const,
    assignedMachine: "Main Crusher #402",
    macAddress: "A1:B2:C3:D4:E5:F1",
    isHighPriority: true,
    signalStrength: -48,
    lastHeartbeatAt: new Date(),
    status: "active" as const,
  },
  {
    deviceId: "DEV-1002",
    type: "shunt_trip" as const,
    assignedMachine: "Secondary Conveyor",
    macAddress: "A1:B2:C3:D4:E5:F2",
    isHighPriority: false,
    signalStrength: -92,
    lastHeartbeatAt: new Date(Date.now() - 45000),
    status: "warning" as const,
  },
  {
    deviceId: "GTWY-01",
    type: "gateway" as const,
    assignedMachine: "Central Hub A",
    macAddress: "A1:B2:C3:D4:E5:F3",
    isHighPriority: true,
    signalStrength: 0,
    lastHeartbeatAt: new Date(),
    status: "active" as const,
  },
  {
    deviceId: "DEV-1003",
    type: "field_controller" as const,
    assignedMachine: "Ventilation System 02",
    macAddress: "A1:B2:C3:D4:E5:F4",
    isHighPriority: false,
    signalStrength: -72,
    lastHeartbeatAt: new Date(Date.now() - 8000),
    status: "active" as const,
  },
  {
    deviceId: "DEV-1004",
    type: "field_controller" as const,
    assignedMachine: "Hydraulic Press #03",
    macAddress: "A1:B2:C3:D4:E5:F5",
    isHighPriority: true,
    signalStrength: -55,
    lastHeartbeatAt: new Date(Date.now() - 120000),
    status: "active" as const,
  },
  {
    deviceId: "DEV-1005",
    type: "shunt_trip" as const,
    assignedMachine: "Boiler System A",
    macAddress: "A1:B2:C3:D4:E5:F6",
    isHighPriority: true,
    signalStrength: -88,
    lastHeartbeatAt: new Date(Date.now() - 300000),
    status: "warning" as const,
  },
  {
    deviceId: "DEV-1006",
    type: "field_controller" as const,
    assignedMachine: "Packaging Line 01",
    macAddress: "A1:B2:C3:D4:E5:F7",
    isHighPriority: false,
    signalStrength: -42,
    lastHeartbeatAt: new Date(Date.now() - 5000),
    status: "active" as const,
  },
  {
    deviceId: "GTWY-02",
    type: "gateway" as const,
    assignedMachine: "Warehouse Wing B",
    macAddress: "A1:B2:C3:D4:E5:F8",
    isHighPriority: true,
    signalStrength: 0,
    lastHeartbeatAt: new Date(Date.now() - 2000),
    status: "active" as const,
  },
  {
    deviceId: "DEV-1007",
    type: "field_controller" as const,
    assignedMachine: "Cooling Tower #1",
    macAddress: "A1:B2:C3:D4:E5:F9",
    isHighPriority: false,
    signalStrength: -65,
    lastHeartbeatAt: new Date(Date.now() - 60000),
    status: "offline" as const,
  },
  {
    deviceId: "DEV-1008",
    type: "shunt_trip" as const,
    assignedMachine: "HV Transformer-A",
    macAddress: "B1:C2:D3:E4:F5:A1",
    isHighPriority: true,
    signalStrength: -76,
    lastHeartbeatAt: new Date(Date.now() - 900000),
    status: "warning" as const,
  },
  {
    deviceId: "DEV-1009",
    type: "field_controller" as const,
    assignedMachine: "Conveyor Main Belt",
    macAddress: "B1:C2:D3:E4:F5:A2",
    isHighPriority: false,
    signalStrength: -38,
    lastHeartbeatAt: new Date(),
    status: "active" as const,
  },
  {
    deviceId: "DEV-1010",
    type: "gateway" as const,
    assignedMachine: "Remote Substation 03",
    macAddress: "B1:C2:D3:E4:F5:A3",
    isHighPriority: false,
    signalStrength: -30,
    lastHeartbeatAt: new Date(Date.now() - 15000),
    status: "active" as const,
  },
  {
    deviceId: "DEV-1011",
    type: "field_controller" as const,
    assignedMachine: "Sprayer Unit 04",
    macAddress: "B1:C2:D3:E4:F5:A4",
    isHighPriority: false,
    signalStrength: -60,
    lastHeartbeatAt: new Date(Date.now() - 7200000),
    status: "offline" as const,
  },
  {
    deviceId: "DEV-1012",
    type: "shunt_trip" as const,
    assignedMachine: "Emergency Generator",
    macAddress: "B1:C2:D3:E4:F5:A5",
    isHighPriority: true,
    signalStrength: -50,
    lastHeartbeatAt: new Date(Date.now() - 180000),
    status: "active" as const,
  },
]

async function seed() {
  console.log("Seeding database...")

  const adminPasswordHash = await bcrypt.hash("Admin@1234", 10)
  const userPasswordHash = await bcrypt.hash("User@1234", 10)

  const users = [
    {
      name: "Sarah Jenkins",
      email: "admin@elock.dev",
      passwordHash: adminPasswordHash,
      role: "admin" as const,
      employeeId: "P-104",
      position: "SYSTEM ADMIN",
      securityLevel: 5,
      status: "active" as const,
    },
    {
      name: "Maria Rodriguez",
      email: "admin2@elock.dev",
      passwordHash: adminPasswordHash,
      role: "admin" as const,
      employeeId: "P-102",
      position: "SAFETY SUPERVISOR",
      securityLevel: 5,
      status: "active" as const,
    },
    {
      name: "Alex Thompson",
      email: "user@elock.dev",
      passwordHash: userPasswordHash,
      role: "senior_engineer" as const,
      employeeId: "P-101",
      position: "SENIOR ELECTRICIAN",
      securityLevel: 4,
      status: "active" as const,
    },
    {
      name: "Ken Chen",
      email: "user2@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
      employeeId: "P-103",
      position: "MAINTENANCE ENGINEER",
      securityLevel: 3,
      status: "off-site" as const,
    },
    {
      name: "Robert Miller",
      email: "user3@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
      employeeId: "P-105",
      position: "JUNIOR TECHNICIAN",
      securityLevel: 2,
      status: "active" as const,
    },
  ]

  try {
    for (const user of users) {
      await db
        .insert(UserTable)
        .values(user)
        .onConflictDoNothing({ target: UserTable.email })
    }
    console.log(`Seeded ${users.length} users`)

    for (const device of devices) {
      await db
        .insert(DeviceTable)
        .values(device)
        .onConflictDoNothing({ target: DeviceTable.deviceId })
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
