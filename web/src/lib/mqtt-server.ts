import mqtt from "mqtt"
import { env } from "@/data/env/server"
import { challenges, verifyChallenge } from "@/features/auth/server/challenges"
import { completeEnrollment } from "@/features/personnel/server/enrollments"

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

  client.on("message", (topic, payload) => {
    const message = payload.toString()
    try {
      const data = JSON.parse(message)

      if (topic === "elock/auth" && data.event === "auth_granted") {
        const fingerprintId = data.id as number
        console.log(`[MQTT Server] Auth granted for fingerprint ID ${fingerprintId}`)

        for (const [token, challenge] of challenges.entries()) {
          if (challenge.fingerprintId === fingerprintId && !challenge.verified) {
            verifyChallenge(token)
            console.log(`[MQTT Server] Challenge ${token} verified`)
            break
          }
        }
      }

      if (topic === "elock/status" && data.event === "enrollment_success") {
        const fingerprintId = data.id as number
        console.log(`[MQTT Server] Enrollment success for fingerprint ID ${fingerprintId}`)
        completeEnrollment(fingerprintId, "success")
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
