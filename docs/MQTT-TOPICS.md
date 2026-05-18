# MQTT Topic Contracts

## Topic Hierarchy

All topics follow the pattern: `elock/<category>[/<device-id>]`

## Topics

| Topic | Direction | QoS | Retained | Payload Description |
|-------|-----------|-----|----------|---------------------|
| `elock/status` | ESP32 → Broker | 1 | ✅ Yes | Device status (lock state, WiFi, uptime) |
| `elock/command` | Broker → ESP32 | 1 | ❌ No | Remote commands (unlock, lock, enroll, maintenance) |
| `elock/auth` | ESP32 → Broker | 1 | ❌ No | Authentication events (success/failure with fingerprint ID) |
| `elock/log` | ESP32 → Broker | 1 | ❌ No | Detailed LOTO event log entries |

## Payload Schemas

### `elock/status`

```json
{
  "deviceId": "elock-esp32-001",
  "lockState": "locked",
  "systemMode": "normal",
  "wifiConnected": true,
  "mqttConnected": true,
  "enrolledFingerprints": 12,
  "uptimeMs": 3600000,
  "timestamp": 1715000000
}
```

### `elock/command`

```json
{
  "action": "unlock",
  "deviceId": "elock-esp32-001",
  "issuedBy": "admin-001",
  "timestamp": 1715000000
}
```

**Supported actions:** `unlock`, `lock`, `enroll_start`, `enroll_stop`, `maintenance_on`, `maintenance_off`

### `elock/auth`

```json
{
  "deviceId": "elock-esp32-001",
  "fingerprintId": 5,
  "result": "success",
  "lockAction": "unlocked",
  "timestamp": 1715000000
}
```

### `elock/log`

```json
{
  "deviceId": "elock-esp32-001",
  "eventType": "lock_toggle",
  "fingerprintId": 5,
  "previousState": "locked",
  "newState": "unlocked",
  "authResult": "success",
  "timestamp": 1715000000
}
```
