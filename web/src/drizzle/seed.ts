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
    },
    {
      name: "Admin Two",
      email: "admin2@elock.dev",
      passwordHash: adminPasswordHash,
      role: "admin" as const,
    },
    {
      name: "Alex Thompson",
      email: "user@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
    },
    {
      name: "User Two",
      email: "user2@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
    },
    {
      name: "User Three",
      email: "user3@elock.dev",
      passwordHash: userPasswordHash,
      role: "user" as const,
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
