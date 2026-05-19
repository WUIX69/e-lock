#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "config.h"
#include "constants.h"
#include "types.h"

#include "wifi-manager.h"
#include "mqtt-handler.h"
#include "fingerprint-sensor.h"
#include "lock-controller.h"
#include "buzzer-led.h"

WifiManager wifiManager(kWifiSsid, kWifiPassword);
WiFiClient wifiClient;
MqttHandler mqttHandler(wifiClient, kMqttBrokerHost, kMqttBrokerPort);
LockController lockController(kLockRelayPin);
BuzzerLed buzzerLed(kBuzzerPin, kLedGreenPin, kLedRedPin);

HardwareSerial fingerprintSerial(2);
FingerprintSensor fingerprintSensor(fingerprintSerial, kFingerprintRxPin, kFingerprintTxPin);

SystemMode currentMode = SystemMode::kNormal;
unsigned long lastUnlockTime = 0;
bool unlockActive = false;

void handleMqttMessage(const char* topic, const char* payload) {
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
        Serial.printf("[E-Lock] MQTT parse error: %s\n", error.c_str());
        return;
    }

    if (strcmp(topic, kMqttTopicCommand) == 0) {
        const char* action = doc["action"];

        if (strcmp(action, "unlock") == 0) {
            lockController.unlock();
            unlockActive = true;
            lastUnlockTime = millis();
            buzzerLed.signalSuccess();

            JsonDocument statusDoc;
            statusDoc["event"] = "remote_unlock";
            statusDoc["state"] = "unlocked";
            char statusBuf[128];
            serializeJson(statusDoc, statusBuf);
            mqttHandler.publish(kMqttTopicStatus, statusBuf);

            Serial.printf("[E-Lock] Remote unlock triggered\n");

        } else if (strcmp(action, "lock") == 0) {
            lockController.lock();
            unlockActive = false;
            buzzerLed.setIdle();

            JsonDocument statusDoc;
            statusDoc["event"] = "remote_lock";
            statusDoc["state"] = "locked";
            char statusBuf[128];
            serializeJson(statusDoc, statusBuf);
            mqttHandler.publish(kMqttTopicStatus, statusBuf);

            Serial.printf("[E-Lock] Remote lock triggered\n");

        } else if (strcmp(action, "enroll") == 0) {
            uint16_t enrollId = doc["id"] | 0;
            currentMode = SystemMode::kEnrollment;

            JsonDocument statusDoc;
            statusDoc["event"] = "enrollment_mode";
            statusDoc["id"] = enrollId;
            char statusBuf[128];
            serializeJson(statusDoc, statusBuf);
            mqttHandler.publish(kMqttTopicStatus, statusBuf);
            buzzerLed.signalWarning();

            Serial.printf("[E-Lock] Enrollment mode activated for ID %d\n", enrollId);

        } else if (strcmp(action, "status") == 0) {
            JsonDocument statusDoc;
            statusDoc["lockState"] = lockController.getState() == LockState::kUnlocked ? "unlocked" : "locked";
            statusDoc["wifi"] = wifiManager.getLocalIp();
            statusDoc["mqtt"] = mqttHandler.isConnected();
            statusDoc["mode"] = currentMode == SystemMode::kEnrollment ? "enrollment" : "normal";
            statusDoc["uptime"] = millis();
            char statusBuf[256];
            serializeJson(statusDoc, statusBuf);
            mqttHandler.publish(kMqttTopicStatus, statusBuf);
        }
    }
}

void setup() {
    Serial.begin(kSerialBaudRate);
    Serial.println("[E-Lock] Initializing...");

    buzzerLed.begin();
    lockController.begin();

    if (!fingerprintSensor.begin()) {
        Serial.println("[E-Lock] Fingerprint sensor FAILED");
        buzzerLed.signalFailure();
    }

    if (wifiManager.connect(kWifiConnectTimeoutMs)) {
        Serial.printf("[E-Lock] WiFi connected: %s\n", wifiManager.getLocalIp());
    } else {
        Serial.println("[E-Lock] WiFi connection FAILED");
        buzzerLed.signalWarning();
    }

    mqttHandler.begin(kMqttClientId, kMqttUsername, kMqttPassword);
    mqttHandler.onMessage(handleMqttMessage);
    mqttHandler.subscribe(kMqttTopicCommand);

    buzzerLed.signalSuccess();
    Serial.println("[E-Lock] Ready");
}

void loop() {
    mqttHandler.loop();

    if (unlockActive && (millis() - lastUnlockTime >= kLockEngageDurationMs)) {
        lockController.lock();
        unlockActive = false;
        buzzerLed.setIdle();
        Serial.println("[E-Lock] Auto-relock after timeout");
    }

    if (currentMode == SystemMode::kEnrollment) {
        uint16_t newId = 0;
        AuthResult enrollResult = fingerprintSensor.scan(newId);
        if (enrollResult == AuthResult::kSuccess) {
            JsonDocument doc;
            doc["event"] = "enrollment_scan_ok";
            doc["id"] = newId;
            char buf[128];
            serializeJson(doc, buf);
            mqttHandler.publish(kMqttTopicStatus, buf);
            Serial.printf("[E-Lock] Enrollment scan success for ID %d\n", newId);
        }
        delay(100);
        return;
    }

    uint16_t fingerprintId = 0;
    AuthResult result = fingerprintSensor.scan(fingerprintId);

    if (result == AuthResult::kSuccess) {
        Serial.printf("[E-Lock] Access granted for ID %d\n", fingerprintId);
        lockController.unlock();
        unlockActive = true;
        lastUnlockTime = millis();
        buzzerLed.signalSuccess();

        JsonDocument doc;
        doc["event"] = "auth_granted";
        doc["id"] = fingerprintId;
        doc["state"] = "unlocked";
        char buf[128];
        serializeJson(doc, buf);
        mqttHandler.publish(kMqttTopicAuth, buf);
    } else if (result == AuthResult::kFailed) {
        Serial.println("[E-Lock] Scan failed - poor image quality");
        buzzerLed.signalWarning();
    } else if (result == AuthResult::kNotEnrolled) {
        Serial.println("[E-Lock] Access denied - fingerprint not recognized");
        buzzerLed.signalFailure();

        JsonDocument doc;
        doc["event"] = "auth_denied";
        doc["reason"] = "not_enrolled";
        char buf[128];
        serializeJson(doc, buf);
        mqttHandler.publish(kMqttTopicAuth, buf);
    }

    delay(100);
}
