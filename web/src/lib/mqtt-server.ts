import mqtt from "mqtt"
import { env } from "@/data/env/server"
import { challenges, verifyChallenge, incrementFailedAttempt, resetFailedAttempts, setChallengeUserId } from "@/features/auth/server/challenges"
import { completeEnrollment } from "@/features/personnel/server/enrollments"
import { getUserByFingerprintId } from "@/features/personnel/server/db/personnel"
import { db } from "@/drizzle/db"
import { TaskTable, DeviceTable } from "@/drizzle/schema"
import { eq, and } from "drizzle-orm"

const globalForMqtt = globalThis as unknown as {
  mqttClient: mqtt.MqttClient | null
}

if (!globalForMqtt.mqttClient) {
  const client = mqtt.connect(env.MQTT_BROKER_URL, {
    username: env.MQTT_USERNAME,
    password: env.MQTT_PASSWORD,
    clientId: `elock-server-${Date.now()}`,
    clean: true,
  })

  client.on("connect", () => {
    console.log("[MQTT Server] Connected to broker")
    client.subscribe("elock/auth", { qos: 1 })
    client.subscribe("elock/status", { qos: 1 })
  })

  client.on("message", async (topic, payload) => {
    const message = payload.toString()
    try {
      const data = JSON.parse(message)

      if (topic === "elock/auth" && data.event === "auth_granted") {
        const fingerprintId = data.id as number
        console.log(`[MQTT Server] Auth granted for fingerprint ID ${fingerprintId}`)

        for (const [token, challenge] of challenges.entries()) {
          if (challenge.verified) continue

          if (challenge.fingerprintId === fingerprintId) {
            resetFailedAttempts(token)
            verifyChallenge(token)
            console.log(`[MQTT Server] Challenge ${token} verified (exact match)`)
            break
          }

          if (challenge.fingerprintId === null) {
            const user = await getUserByFingerprintId(fingerprintId)
            if (user) {
              resetFailedAttempts(token)
              setChallengeUserId(token, user.id)
              verifyChallenge(token)
              console.log(`[MQTT Server] Challenge ${token} verified (listening match for ${user.name})`)
              break
            }
            continue
          }

          const attempts = incrementFailedAttempt(token)
          console.log(`[MQTT Server] Wrong finger for challenge ${token}, failed attempts: ${attempts}`)
        }
      }

      if (topic === "elock/auth" && data.event === "auth_denied" && data.reason === "not_enrolled") {
        console.log(`[MQTT Server] Auth denied: unrecognized fingerprint`)

        for (const [token, challenge] of challenges.entries()) {
          if (challenge.verified) continue
          const attempts = incrementFailedAttempt(token)
          console.log(`[MQTT Server] Failed attempts for ${token}: ${attempts}`)
        }
      }

      if (topic === "elock/status" && data.event === "enrollment_success") {
        const fingerprintId = data.id as number
        console.log(`[MQTT Server] Enrollment success for fingerprint ID ${fingerprintId}`)
        completeEnrollment(fingerprintId, "success")
      }

      if (topic === "elock/status" && data.event === "relay_fault") {
        const deviceIdString = data.deviceId as string
        console.log(`[MQTT Server] Relay fault alert received for device ID: ${deviceIdString}`)

        const device = await db.query.DeviceTable.findFirst({
          where: eq(DeviceTable.deviceId, deviceIdString)
        })

        if (device) {
          const activeTask = await db.query.TaskTable.findFirst({
            where: and(
              eq(TaskTable.deviceId, device.id),
              eq(TaskTable.status, "pending"),
              eq(TaskTable.approvedByAdmin, true)
            )
          })

          if (activeTask) {
            await db
              .update(TaskTable)
              .set({ relayFault: true })
              .where(eq(TaskTable.id, activeTask.id))
            console.log(`[MQTT Server] Set relayFault = true for task ${activeTask.id}`)
          } else {
            console.warn(`[MQTT Server] No active approved task found for device ${deviceIdString}`)
          }
        } else {
          console.error(`[MQTT Server] Device with ID ${deviceIdString} not found`)
        }
      }
    } catch {
      console.error("[MQTT Server] Failed to parse message:", message)
    }
  })

  client.on("error", (err) => {
    console.error("[MQTT Server] Error:", err)
  })

  globalForMqtt.mqttClient = client
}

export function publishMqtt(topic: string, payload: Record<string, unknown>) {
  const client = globalForMqtt.mqttClient
  if (client && client.connected) {
    client.publish(topic, JSON.stringify(payload), { qos: 1 })
  } else {
    console.warn("[MQTT Server] Client not connected, cannot publish")
  }
}

export function getMqttClient() {
  return globalForMqtt.mqttClient
}