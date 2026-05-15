import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  emptyStringAsUndefined: true,
  client: {
    NEXT_PUBLIC_MQTT_WS_URL: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_MQTT_WS_URL: process.env.NEXT_PUBLIC_MQTT_WS_URL,
  },
})
