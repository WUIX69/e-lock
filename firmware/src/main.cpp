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
#include "esp-now-handler.h"

WifiManager wifiManager(kWifiSsid, kWifiPassword);
WiFiClient wifiClient;
MqttHandler mqttHandler(wifiClient, kMqttBrokerHost, kMqttBrokerPort);
LockController lockController(kLockRelayPin);
BuzzerLed buzzerLed(kBuzzerPin, kLedGreenPin, kLedRedPin);
EspNowHandler espNowHandler;

HardwareSerial fingerprintSerial(2);
FingerprintSensor fingerprintSensor(fingerprintSerial, kFingerprintRxPin, kFingerprintTxPin);

SystemMode currentMode = SystemMode::kNormal;
unsigned long lastUnlockTime = 0;
bool unlockActive = false;
uint16_t pendingEnrollId = 0;
unsigned long lastAuthTime = 0;

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
            pendingEnrollId = doc["id"] | 0;
            currentMode = SystemMode::kEnrollment;
            fingerprintSensor.startEnroll(pendingEnrollId);

            JsonDocument statusDoc;
            statusDoc["event"] = "enrollment_mode";
            statusDoc["id"] = pendingEnrollId;
            char statusBuf[128];
            serializeJson(statusDoc, statusBuf);
            mqttHandler.publish(kMqttTopicStatus, statusBuf);
            buzzerLed.signalWarning();

            Serial.printf("[E-Lock] Enrollment mode activated for ID %d\n", pendingEnrollId);

        } else if (strcmp(action, "cancel") == 0) {
            currentMode = SystemMode::kNormal;
            fingerprintSensor.cancelEnroll();
            buzzerLed.setIdle();
            Serial.println("[E-Lock] Enrollment cancelled");

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

        } else if (strcmp(action, "delete") == 0) {
            uint16_t fpId = doc["id"] | 0;
            bool success = fingerprintSensor.deleteFingerprint(fpId);

            JsonDocument statusDoc;
            statusDoc["event"] = success ? "fingerprint_deleted" : "fingerprint_delete_failed";
            statusDoc["id"] = fpId;
            char statusBuf[128];
            serializeJson(statusDoc, statusBuf);
            mqttHandler.publish(kMqttTopicStatus, statusBuf);
            Serial.printf("[E-Lock] %s fingerprint ID %d\n",
                          success ? "Deleted" : "Failed to delete", fpId);

        } else if (strcmp(action, "clear") == 0) {
            bool success = fingerprintSensor.deleteAllFingerprints();

            JsonDocument statusDoc;
            statusDoc["event"] = success ? "fingerprints_cleared" : "fingerprints_clear_failed";
            statusDoc["count"] = fingerprintSensor.getEnrolledCount();
            char statusBuf[128];
            serializeJson(statusDoc, statusBuf);
            mqttHandler.publish(kMqttTopicStatus, statusBuf);
            Serial.printf("[E-Lock] %s\n",
                          success ? "All fingerprints cleared" : "Failed to clear fingerprints");

        } else if (strcmp(action, "maintenance_on") == 0 || strcmp(action, "maintenance_off") == 0) {
            const char* targetDeviceId = doc["deviceId"] | "";
            const uint8_t* targetMac = nullptr;
            for (size_t i = 0; i < kLotoDeviceCount; i++) {
                if (strcmp(kLotoDevices[i].deviceId, targetDeviceId) == 0) {
                    targetMac = kLotoDevices[i].mac;
                    break;
                }
            }
            if (targetMac == nullptr) {
                Serial.printf("[E-Lock] Unknown device: %s\n", targetDeviceId);
            } else {
                EspNowMessage msg = {};
                strcpy(msg.command, strcmp(action, "maintenance_on") == 0 ? "START" : "STOP");
                strcpy(msg.deviceId, targetDeviceId);
                espNowHandler.send(targetMac, (const uint8_t*)&msg, sizeof(msg));
                Serial.printf("[E-Lock] Forwarded %s to %s\n", msg.command, targetDeviceId);
            }
        }
    }
}

void onEspNowReceive(const uint8_t* mac, const uint8_t* data, int len) {
    if (len < 4) return;
    EspNowMessage msg = {};
    size_t copyLen = (len < sizeof(msg)) ? len : sizeof(msg);
    memcpy(&msg, data, copyLen);
    
    if (strcmp(msg.command, "ALERT") == 0) {
        JsonDocument doc;
        doc["event"] = "relay_fault";
        doc["deviceId"] = msg.deviceId;
        char buf[128];
        serializeJson(doc, buf);
        mqttHandler.publish(kMqttTopicStatus, buf);
        Serial.printf("[E-Lock] Relay fault alert received for %s, published to MQTT\n", msg.deviceId);
    }
}

void setup() {
    Serial.begin(kSerialBaudRate);
    Serial.println("[E-Lock] Initializing...");
    Serial.print("[E-Lock] ESP32 #1 (Gateway) MAC Address: ");
    Serial.println(WiFi.macAddress());

    buzzerLed.begin();
    lockController.begin();

    if (!fingerprintSensor.begin()) {
        Serial.println("[E-Lock] Fingerprint sensor FAILED");
        buzzerLed.signalFailure();
    } else {
        Serial.printf("[E-Lock] Sensor has %d fingerprint(s) stored\n",
                      fingerprintSensor.getEnrolledCount());
    }

    if (wifiManager.connect(kWifiConnectTimeoutMs)) {
        Serial.printf("[E-Lock] WiFi connected: %s (Channel: %d)\n", wifiManager.getLocalIp(), WiFi.channel());
    } else {
        Serial.println("[E-Lock] WiFi connection FAILED");
        buzzerLed.signalWarning();
    }

    if (espNowHandler.begin()) {
        for (size_t i = 0; i < kLotoDeviceCount; i++) {
            bool exists = false;
            for (size_t j = 0; j < i; j++) {
                if (memcmp(kLotoDevices[i].mac, kLotoDevices[j].mac, 6) == 0) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                espNowHandler.addPeer(kLotoDevices[i].mac);
            }
        }
        espNowHandler.onReceive(onEspNowReceive);
        Serial.printf("[E-Lock] ESP-NOW initialized with %zu peers\n", kLotoDeviceCount);
    } else {
        Serial.println("[E-Lock] ESP-NOW init FAILED");
    }

    mqttHandler.begin(kMqttClientId, kMqttUsername, kMqttPassword);
    mqttHandler.onMessage(handleMqttMessage);
    mqttHandler.subscribe(kMqttTopicCommand);

    buzzerLed.signalSuccess();
    Serial.println("[E-Lock] Ready");
}

void handleSerialCommand(const String& cmd) {
    if (cmd == "enroll" || cmd.startsWith("enroll ")) {
        int id = 1;
        if (cmd.startsWith("enroll ")) {
            id = cmd.substring(7).toInt();
            if (id < 1 || id > 162) id = 1;
        }
        pendingEnrollId = id;
        currentMode = SystemMode::kEnrollment;
        fingerprintSensor.startEnroll(pendingEnrollId);
        buzzerLed.signalWarning();
    } else if (cmd == "cancel") {
        currentMode = SystemMode::kNormal;
        fingerprintSensor.cancelEnroll();
        buzzerLed.setIdle();
    } else if (cmd == "unlock") {
        lockController.unlock();
        unlockActive = true;
        lastUnlockTime = millis();
        buzzerLed.signalSuccess();
    } else if (cmd == "lock") {
        lockController.lock();
        unlockActive = false;
        buzzerLed.setIdle();
    } else if (cmd == "count") {
        uint16_t count = fingerprintSensor.getEnrolledCount();
        Serial.printf("[E-Lock] Sensor has %d fingerprint(s) stored\n", count);

    } else if (cmd.startsWith("delete ")) {
        int id = cmd.substring(7).toInt();
        if (id < 1 || id > 162) {
            Serial.println("[E-Lock] Invalid ID. Use 1-162");
        } else if (fingerprintSensor.deleteFingerprint(id)) {
            Serial.printf("[E-Lock] Fingerprint ID %d deleted\n", id);
        } else {
            Serial.printf("[E-Lock] Failed to delete fingerprint ID %d\n", id);
        }

    } else if (cmd == "clear") {
        if (fingerprintSensor.deleteAllFingerprints()) {
            Serial.println("[E-Lock] All fingerprints cleared from sensor");
        } else {
            Serial.println("[E-Lock] Failed to clear fingerprints");
        }

    } else if (cmd == "help") {
        Serial.println("[E-Lock] Serial commands:");
        Serial.println("  enroll [id] - Start enrollment (ID 1-162, default 1)");
        Serial.println("  cancel      - Cancel enrollment");
        Serial.println("  unlock      - Unlock solenoid");
        Serial.println("  lock        - Lock solenoid");
        Serial.println("  count       - Show stored fingerprint count");
        Serial.println("  delete <id> - Delete fingerprint (ID 1-162)");
        Serial.println("  clear       - Delete ALL fingerprints from sensor");
        Serial.println("  help        - Show this help");
    }
}

void loop() {
    if (Serial.available() > 0) {
        String cmd = Serial.readStringUntil('\n');
        cmd.trim();
        if (cmd.length() > 0) {
            handleSerialCommand(cmd);
        }
    }

    mqttHandler.loop();

    if (unlockActive && (millis() - lastUnlockTime >= kLockEngageDurationMs)) {
        lockController.lock();
        unlockActive = false;
        buzzerLed.setIdle();
        Serial.println("[E-Lock] Auto-relock after timeout");
    }

    if (currentMode == SystemMode::kEnrollment) {
        uint8_t trialNum = 0;
        uint8_t errorCode = 0;
        if (fingerprintSensor.checkTrialFailed(trialNum, errorCode)) {
            JsonDocument doc;
            doc["event"] = "enrollment_trial_failed";
            doc["id"] = pendingEnrollId;
            doc["trial"] = trialNum;
            doc["error"] = errorCode;
            doc["trialsLeft"] = fingerprintSensor.getEnrollTrials();
            char buf[128];
            serializeJson(doc, buf);
            mqttHandler.publish(kMqttTopicStatus, buf);
        }

        static EnrollStep lastStep = EnrollStep::kIdle;
        EnrollStep step = fingerprintSensor.enrollStep();

        if (step != lastStep) {
            if (step == EnrollStep::kNeedRemoveFinger) {
                JsonDocument doc;
                doc["event"] = "enrollment_first_scan_ok";
                doc["id"] = pendingEnrollId;
                char buf[128];
                serializeJson(doc, buf);
                mqttHandler.publish(kMqttTopicStatus, buf);
            } else if (step == EnrollStep::kCreatingModel) {
                JsonDocument doc;
                doc["event"] = "enrollment_second_scan_ok";
                doc["id"] = pendingEnrollId;
                char buf[128];
                serializeJson(doc, buf);
                mqttHandler.publish(kMqttTopicStatus, buf);
            }
            lastStep = step;
        }

        if (step == EnrollStep::kSuccess) {
            JsonDocument doc;
            doc["event"] = "enrollment_success";
            doc["id"] = pendingEnrollId;
            char buf[128];
            serializeJson(doc, buf);
            mqttHandler.publish(kMqttTopicStatus, buf);
            Serial.printf("[E-Lock] Enrollment success for ID %d\n", pendingEnrollId);
            currentMode = SystemMode::kNormal;
            lastStep = EnrollStep::kIdle;
            buzzerLed.signalSuccess();
            pendingEnrollId = 0;
        } else if (step == EnrollStep::kFailed) {
            JsonDocument doc;
            doc["event"] = "enrollment_failed";
            doc["id"] = pendingEnrollId;
            doc["trialsLeft"] = fingerprintSensor.getEnrollTrials();
            char buf[128];
            serializeJson(doc, buf);
            mqttHandler.publish(kMqttTopicStatus, buf);
            Serial.printf("[E-Lock] Enrollment failed for ID %d\n", pendingEnrollId);
            fingerprintSensor.cancelEnroll();
            currentMode = SystemMode::kNormal;
            lastStep = EnrollStep::kIdle;
            buzzerLed.signalFailure();
            pendingEnrollId = 0;
        }
        delay(100);
        return;
    }

    // Post-auth cooldown prevents ghost re-trigger after auto-relock
    if (millis() - lastAuthTime < 2000) {
        delay(100);
        return;
    }

    uint16_t fingerprintId = 0;
    AuthResult result = fingerprintSensor.scan(fingerprintId);

    if (result == AuthResult::kSuccess) {
        lastAuthTime = millis();
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

        JsonDocument doc;
        doc["event"] = "auth_denied";
        doc["reason"] = "poor_quality";
        char buf[128];
        serializeJson(doc, buf);
        mqttHandler.publish(kMqttTopicAuth, buf);
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

    delay(300);
}
