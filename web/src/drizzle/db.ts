import { env } from "@/data/env/server"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "@/drizzle/schema"

// HACK: Singleton prevents multiple pool instances during Next.js hot reload
const globalForDb = globalThis as unknown as { dbClient: postgres.Sql }
const client = globalForDb.dbClient ?? postgres(env.DATABASE_URL)
if (process.env.NODE_ENV !== "production") globalForDb.dbClient = client

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development",
})
