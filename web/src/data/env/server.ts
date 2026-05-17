import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    DATABASE_URL: z.string().url(),
    MQTT_BROKER_URL: z.string().min(1),
    MQTT_USERNAME: z.string().min(1),
    MQTT_PASSWORD: z.string().min(1),
    JWT_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default("1h"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  },
  experimental__runtimeEnv: process.env,
})
