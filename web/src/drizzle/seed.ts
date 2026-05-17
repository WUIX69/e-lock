import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { UserTable } from "./schema"
import * as bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("DATABASE_URL is not set")
  process.exit(1)
}

const client = postgres(connectionString)
const db = drizzle(client)

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
      securityLevel: "Level 5 (Admin)",
      status: "active" as const,
    },
    {
      name: "Maria Rodriguez",
      email: "admin2@elock.dev",
      passwordHash: adminPasswordHash,
      role: "admin" as const,
      employeeId: "P-102",
      position: "SAFETY SUPERVISOR",
      securityLevel: "Level 5 (Admin)",
      status: "active" as const,
    },
    {
      name: "Alex Thompson",
      email: "user@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
      employeeId: "P-101",
      position: "SENIOR ELECTRICIAN",
      securityLevel: "Level 4 (LOTO)",
      status: "active" as const,
    },
    {
      name: "Ken Chen",
      email: "user2@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
      employeeId: "P-103",
      position: "MAINTENANCE ENGINEER",
      securityLevel: "Level 3",
      status: "off-site" as const,
    },
    {
      name: "Robert Miller",
      email: "user3@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
      employeeId: "P-105",
      position: "JUNIOR TECHNICIAN",
      securityLevel: "Level 2",
      status: "active" as const,
    },
  ]

  try {
    for (const user of users) {
      await db.insert(UserTable).values(user).onConflictDoNothing({ target: UserTable.email })
    }
    console.log("Seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.end()
  }
}

seed()
