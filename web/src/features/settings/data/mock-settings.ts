export interface SystemSettings {
  mqttBrokerUrl: string
  espNowChannel: string
  heartbeatInterval: number
  voltageSensitivity: number
  tdrGracePeriod: number
  shuntTripDelay: number
  biometricRetryLimit: number
  pinTimeout: string
  firmwareVersion: string
}

export const MOCK_SETTINGS: SystemSettings = {
  mqttBrokerUrl: "mqtt://industrial.mesh.local:1883",
  espNowChannel: "Channel 06 (2437 MHz)",
  heartbeatInterval: 5000,
  voltageSensitivity: 0.85,
  tdrGracePeriod: 150,
  shuntTripDelay: 50,
  biometricRetryLimit: 3,
  pinTimeout: "15 min",
  firmwareVersion: "v2.4.1 STABLE",
}

export const NETWORK_STATS = {
  signalStrength: -42,
  signalStatus: "Excellent Connection",
  nodePairing: { used: 14, total: 32 },
}

export const BACKUP_STATS = {
  lastBackup: "Today, 04:12 AM",
  archiveSize: "124.8 MB",
  integrityCheck: "PASSED (SHA-256)",
}