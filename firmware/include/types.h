#pragma once

#include <cstdint>

// ============================================================
// E-Lock Shared Type Definitions
// Enums and structs used across firmware modules
// ============================================================

enum class LockState : uint8_t {
    kLocked = 0,
    kUnlocked = 1,
    kError = 2,
};

enum class AuthResult : uint8_t {
    kSuccess = 0,
    kFailed = 1,
    kTimeout = 2,
    kNotEnrolled = 3,
};

enum class SystemMode : uint8_t {
    kNormal = 0,
    kEnrollment = 1,
    kMaintenance = 2,
};

struct LotoEvent {
    uint32_t timestamp;
    uint16_t fingerprintId;
    LockState previousState;
    LockState newState;
    AuthResult authResult;
};

struct DeviceStatus {
    LockState lockState;
    SystemMode systemMode;
    bool isWifiConnected;
    bool isMqttConnected;
    uint16_t enrolledFingerprints;
    uint32_t uptimeMs;
};
