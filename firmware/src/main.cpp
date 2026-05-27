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
uint16_t pendingEnrollId = 0;

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
    } else if (cmd == "help") {
        Serial.println("[E-Lock] Serial commands:");
        Serial.println("  enroll [id] - Start enrollment (ID 1-162, default 1)");
        Serial.println("  cancel      - Cancel enrollment");
        Serial.println("  unlock      - Unlock solenoid");
        Serial.println("  lock        - Lock solenoid");
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
