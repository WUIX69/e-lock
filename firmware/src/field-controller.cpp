#include <Arduino.h>
#include <esp_wifi.h>
#include <esp_system.h>
#include "config.h"
#include "constants.h"
#include "types.h"
#include "esp-now-handler.h"

EspNowHandler espNowHandler;

int getDeviceIndex(const char* deviceId) {
    if (strcmp(deviceId, "DEV-FC02") == 0) {
        return 1;
    }
    return 0;
}

uint8_t getDeviceMainRelayPin(int index) {
    return (index == 1) ? kLotoMainRelayPinDevice2 : kLotoMainRelayPin;
}

LotoState deviceStates[2] = {LotoState::kStandby, LotoState::kStandby};
unsigned long stateStartMs[2] = {0, 0};
volatile bool commandReceived[2] = {false, false};
volatile LotoState pendingCommands[2] = {LotoState::kStandby, LotoState::kStandby};

void onEspNowReceive(const uint8_t* mac, const uint8_t* data, int len) {
    if (len < 4) return;
    EspNowMessage msg = {};
    memcpy(&msg, data, min((size_t)len, sizeof(msg)));

    int idx = getDeviceIndex(msg.deviceId);

    if (strcmp(msg.command, "START") == 0) {
        pendingCommands[idx] = LotoState::kDelay;
        commandReceived[idx] = true;
    } else if (strcmp(msg.command, "STOP") == 0) {
        pendingCommands[idx] = LotoState::kStandby;
        commandReceived[idx] = true;
    }
}

void setRelaysHigh() {
    digitalWrite(kLotoMainRelayPin, HIGH);
    digitalWrite(kLotoMainRelayPinDevice2, HIGH);
    digitalWrite(kLotoShuntRelayPin, HIGH);
    digitalWrite(kLotoTimerRelayPin, HIGH);
    digitalWrite(kPilotLightPin, HIGH);
}

void setup() {
    Serial.begin(kSerialBaudRate);
    Serial.println("[E-Lock] Field Controller Initializing...");

    {
        uint8_t mac[6];
        esp_read_mac(mac, ESP_MAC_WIFI_STA);
        Serial.printf("[E-Lock] ESP32 #2 (Field Controller) MAC Address: %02X:%02X:%02X:%02X:%02X:%02X\n",
                      mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    }

    pinMode(kLotoMainRelayPin, OUTPUT);
    pinMode(kLotoMainRelayPinDevice2, OUTPUT);
    pinMode(kLotoShuntRelayPin, OUTPUT);
    pinMode(kLotoTimerRelayPin, OUTPUT);
    pinMode(kPilotLightPin, OUTPUT);
    pinMode(kLotoBypassButtonPin, INPUT_PULLUP);
    pinMode(kLotoZmptPin, INPUT);

    // Initialize all relays and indicators to standby state (HIGH)
    digitalWrite(kLotoMainRelayPin, HIGH);
    digitalWrite(kLotoMainRelayPinDevice2, HIGH);
    digitalWrite(kLotoShuntRelayPin, HIGH);
    digitalWrite(kLotoTimerRelayPin, HIGH);
    digitalWrite(kPilotLightPin, HIGH);

    if (espNowHandler.begin()) {
        esp_wifi_set_channel(kEspNowChannel, WIFI_SECOND_CHAN_NONE);
        espNowHandler.onReceive(onEspNowReceive);
        Serial.println("[E-Lock] ESP-NOW listening");
    } else {
        Serial.println("[E-Lock] ESP-NOW init FAILED");
    }

    Serial.println("[E-Lock] Field Controller Ready");
}

void loop() {
    for (int i = 0; i < 2; i++) {
        if (commandReceived[i]) {
            commandReceived[i] = false;
            if (pendingCommands[i] == LotoState::kDelay && deviceStates[i] == LotoState::kStandby) {
                deviceStates[i] = LotoState::kDelay;
                stateStartMs[i] = millis();
                Serial.printf("[E-Lock] LOTO START for Device %d - 10s delay\n", i + 1);
            } else if (pendingCommands[i] == LotoState::kStandby) {
                deviceStates[i] = LotoState::kStandby;
                digitalWrite(getDeviceMainRelayPin(i), HIGH);
                Serial.printf("[E-Lock] LOTO STOP for Device %d - returning to standby\n", i + 1);

                // If BOTH devices are now in Standby, restore safety relays and pilot light
                if (deviceStates[0] == LotoState::kStandby && deviceStates[1] == LotoState::kStandby) {
                    digitalWrite(kLotoShuntRelayPin, HIGH);
                    digitalWrite(kLotoTimerRelayPin, HIGH);
                    digitalWrite(kPilotLightPin, HIGH);
                }
            }
        }
    }

    // Bypass button: resets both devices if either is tripped
    bool isAnyTripped = (deviceStates[0] == LotoState::kTripped || deviceStates[1] == LotoState::kTripped);
    if (isAnyTripped && digitalRead(kLotoBypassButtonPin) == LOW) {
        delay(50);
        if (digitalRead(kLotoBypassButtonPin) == LOW) {
            for (int i = 0; i < 2; i++) {
                deviceStates[i] = LotoState::kStandby;
                pendingCommands[i] = LotoState::kStandby;
            }
            setRelaysHigh();
            Serial.println("[E-Lock] Bypass pressed - returning both to standby");
            while (digitalRead(kLotoBypassButtonPin) == LOW) {
                delay(10);
            }
        }
    }

    // Process state machine for both devices
    for (int i = 0; i < 2; i++) {
        switch (deviceStates[i]) {
            case LotoState::kStandby:
                break;

            case LotoState::kDelay:
                if (millis() - stateStartMs[i] >= kLotoDelayDurationMs) {
                    digitalWrite(getDeviceMainRelayPin(i), LOW);
                    digitalWrite(kPilotLightPin, LOW);
                    deviceStates[i] = LotoState::kMonitoring;
                    stateStartMs[i] = millis();
                    Serial.printf("[E-Lock] LOTO power cut for Device %d - monitoring\n", i + 1);
                }
                break;

            case LotoState::kMonitoring:
                if (i == 0 && analogRead(kLotoZmptPin) > kLotoVoltageThreshold) {
                    digitalWrite(kLotoShuntRelayPin, LOW);
                    digitalWrite(kLotoTimerRelayPin, LOW);
                    // Trip all monitoring devices
                    for (int j = 0; j < 2; j++) {
                        if (deviceStates[j] == LotoState::kMonitoring) {
                            deviceStates[j] = LotoState::kTripped;
                        }
                    }
                    Serial.println("[E-Lock] LOTO TRIPPED - voltage detected");
                }
                break;

            case LotoState::kTripped:
                break;
        }
    }

    delay(50);
}
