#include <Arduino.h>
#include <WiFi.h>
#include <esp_wifi.h>
#include <esp_system.h>
#include "config.h"
#include "constants.h"
#include "types.h"
#include "esp-now-handler.h"

EspNowHandler espNowHandler;

bool isVoltagePresent() {
    int maxVal = 0;
    int minVal = 4095;
    unsigned long startMs = millis();
    while (millis() - startMs < 25) { // sample over 25ms (covers > 1 full cycle of 50Hz/60Hz AC)
        int val = analogRead(kLotoZmptPin);
        if (val > maxVal) maxVal = val;
        if (val < minVal) minVal = val;
    }
    int peakToPeak = maxVal - minVal;
    return peakToPeak > 1500; // robust threshold to distinguish noise from real mains voltage
}

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

    // Set WiFi to STA mode and scan for target router channel
    WiFi.mode(WIFI_STA);
    int targetChannel = 1;
    Serial.println("[E-Lock] Scanning WiFi to align ESP-NOW channel...");
    int n = WiFi.scanNetworks();
    for (int i = 0; i < n; ++i) {
        if (strcmp(WiFi.SSID(i).c_str(), kWifiSsid) == 0) {
            targetChannel = WiFi.channel(i);
            Serial.printf("[E-Lock] Found target network '%s' on channel %d\n", kWifiSsid, targetChannel);
            break;
        }
    }
    WiFi.scanDelete();

    if (espNowHandler.begin()) {
        esp_wifi_set_promiscuous(true);
        esp_wifi_set_channel(targetChannel, WIFI_SECOND_CHAN_NONE);
        esp_wifi_set_promiscuous(false);

        espNowHandler.onReceive(onEspNowReceive);
        espNowHandler.addPeer(kGatewayMac);
        Serial.printf("[E-Lock] ESP-NOW listening on channel %d and Gateway peer added\n", targetChannel);
    } else {
        Serial.println("[E-Lock] ESP-NOW init FAILED");
    }

    Serial.println("[E-Lock] Field Controller Ready");
}

void loop() {
    for (int i = 0; i < 2; i++) {
        if (commandReceived[i]) {
            commandReceived[i] = false;
            if (pendingCommands[i] == LotoState::kDelay) {
                if (deviceStates[i] != LotoState::kStandby) {
                    // Force reset to Standby (handles kTripped, kMonitoring, kDelay)
                    digitalWrite(getDeviceMainRelayPin(i), HIGH);
                    deviceStates[i] = LotoState::kStandby;
                    Serial.printf("[E-Lock] LOTO RESET for Device %d - forced to standby\n", i + 1);
                    commandReceived[i] = true;
                } else {
                    deviceStates[i] = LotoState::kDelay;
                    stateStartMs[i] = millis();
                    Serial.printf("[E-Lock] LOTO START for Device %d - 10s delay\n", i + 1);
                }
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

    // The physical push button applies voltage to the ZMPT sensor to simulate/test a LOTO fault.
    // Bypass/reset is handled digitally via the web application sending a STOP command.

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
                // ZMPT voltage-based fault check:
                // Device 1 is tripped if voltage is detected (e.g. via physical push button test or real fault)
                // after a 2-second stabilization window to prevent transient noise from causing false trips.
                if (i == 0 && (millis() - stateStartMs[i] > 2000)) {
                    if (isVoltagePresent()) {
                        digitalWrite(kLotoShuntRelayPin, LOW);
                        digitalWrite(kLotoTimerRelayPin, LOW);

                        // Trip all monitoring devices
                        for (int j = 0; j < 2; j++) {
                            if (deviceStates[j] == LotoState::kMonitoring) {
                                deviceStates[j] = LotoState::kTripped;

                                // Send ALERT immediately on trip
                                EspNowMessage alertMsg = {};
                                strcpy(alertMsg.command, "ALERT");
                                strcpy(alertMsg.deviceId, (j == 1) ? "DEV-FC02" : "DEV-FC01");
                                espNowHandler.send(kGatewayMac, (const uint8_t*)&alertMsg, sizeof(alertMsg));
                                Serial.printf("[E-Lock] Sent ALERT ESP-NOW for %s due to voltage detection\n", alertMsg.deviceId);
                                delay(50);
                            }
                        }
                        Serial.println("[E-Lock] LOTO TRIPPED - voltage detected on ZMPT");
                    }
                }
                break;

            case LotoState::kTripped:
                break;
        }
    }

    delay(50);
}
