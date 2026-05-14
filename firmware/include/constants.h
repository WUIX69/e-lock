#pragma once

#include <cstdint>

// ============================================================
// E-Lock System-wide Constants
// Timeouts, retries, and operational parameters
// ============================================================

// --- Timing Constants (milliseconds) ---
constexpr uint32_t kWifiConnectTimeoutMs = 10000;
constexpr uint32_t kMqttReconnectIntervalMs = 5000;
constexpr uint32_t kLockEngageDurationMs = 3000;
constexpr uint32_t kFingerprintScanTimeoutMs = 10000;
constexpr uint32_t kHeartbeatIntervalMs = 30000;

// --- Retry Limits ---
constexpr uint8_t kMaxWifiRetries = 5;
constexpr uint8_t kMaxMqttRetries = 10;
constexpr uint8_t kMaxFingerprintAttempts = 3;

// --- System Limits ---
constexpr uint16_t kMaxStoredFingerprints = 127;
constexpr uint8_t kMaxEspNowPeers = 6;

// --- Serial Baud Rates ---
constexpr uint32_t kSerialBaudRate = 115200;
constexpr uint32_t kFingerprintBaudRate = 57600;
