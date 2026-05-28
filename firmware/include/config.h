#pragma once

// ============================================================
// E-Lock Firmware Configuration
// Pin definitions, WiFi credentials, MQTT broker settings
// ============================================================

// --- WiFi Configuration ---
constexpr const char* kWifiSsid = "FTTH-1A8E";
constexpr const char* kWifiPassword = "IBLAZE_6821";

// --- MQTT Broker Configuration ---
constexpr const char* kMqttBrokerHost = "192.168.1.20";
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
