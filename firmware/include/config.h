#pragma once

#include <cstddef>

// ============================================================
// E-Lock Firmware Configuration
// Pin definitions, WiFi credentials, MQTT broker settings
// ============================================================

// --- WiFi Configuration ---
constexpr const char* kWifiSsid = "Mangalili family";
constexpr const char* kWifiPassword = "mANG@LILI593646";

// --- MQTT Broker Configuration ---
constexpr const char* kMqttBrokerHost = "192.168.5.101";
constexpr uint16_t kMqttBrokerPort = 1883;
constexpr const char* kMqttClientId = "elock-esp32-001";
constexpr const char* kMqttUsername = "elock_mqtt";
constexpr const char* kMqttPassword = "elock_mqtt_2026";

// --- Fingerprint Sensor Pins (UART) ---
constexpr uint8_t kFingerprintRxPin = 16;
constexpr uint8_t kFingerprintTxPin = 17;

// --- Lock/Solenoid Relay Pin ---
constexpr uint8_t kLockRelayPin = 27;

// --- Buzzer Pin ---
constexpr uint8_t kBuzzerPin = 25;

// --- LED Indicator Pins ---
constexpr uint8_t kLedGreenPin = 32;
constexpr uint8_t kLedRedPin = 33;

// --- OLED Display Pins (I2C) ---
constexpr uint8_t kDisplaySdaPin = 21;
constexpr uint8_t kDisplaySclPin = 22;


// --- MQTT Topics ---
constexpr const char* kMqttTopicStatus = "elock/status";
constexpr const char* kMqttTopicCommand = "elock/command";
constexpr const char* kMqttTopicAuth = "elock/auth";
constexpr const char* kMqttTopicLog = "elock/log";

// --- LOTO Device Registry ---
struct LotoDeviceEntry {
    const char* deviceId;
    uint8_t mac[6];
};

constexpr LotoDeviceEntry kLotoDevices[] = {
    {"DEV-FC01", {0x08, 0x3A, 0xF2, 0x82, 0x55, 0xB8}},
    {"DEV-FC02", {0x08, 0x3A, 0xF2, 0x82, 0x55, 0xB8}},
};
constexpr size_t kLotoDeviceCount = sizeof(kLotoDevices) / sizeof(kLotoDevices[0]);

constexpr uint8_t kGatewayMac[6] = {0x28, 0x05, 0xA5, 0x2F, 0xCF, 0xAC};

// --- LOTO Field Controller Relay & Sensor Pins ---
constexpr uint8_t kLotoMainRelayPin = 4;
constexpr uint8_t kLotoMainRelayPinDevice2 = 19;
constexpr uint8_t kLotoShuntRelayPin = 26;
constexpr uint8_t kLotoTimerRelayPin = 5;
constexpr uint8_t kLotoZmptPin = 34;
constexpr uint8_t kPilotLightPin = 21;
constexpr uint8_t kLotoBypassButtonPin = 13;

// --- ESP-NOW Configuration ---
constexpr uint8_t kEspNowChannel = 1;
