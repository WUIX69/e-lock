#include <Arduino.h>
#include <esp_wifi.h>
#include "config.h"
#include "constants.h"
#include "types.h"
#include "esp-now-handler.h"

LotoState currentLotoState = LotoState::kStandby;
EspNowHandler espNowHandler;
unsigned long lotoStateStartMs = 0;
volatile bool lotoCommandReceived = false;
volatile LotoState pendingCommand = LotoState::kStandby;

void onEspNowReceive(const uint8_t* mac, const uint8_t* data, int len) {
    if (len < 4) return;
    EspNowMessage msg;
    memcpy(&msg, data, min((size_t)len, sizeof(msg)));

    if (strcmp(msg.command, "START") == 0) {
        pendingCommand = LotoState::kDelay;
        lotoCommandReceived = true;
    } else if (strcmp(msg.command, "STOP") == 0) {
        pendingCommand = LotoState::kStandby;
        lotoCommandReceived = true;
    }
}

void setRelaysHigh() {
    digitalWrite(kLotoMainRelayPin, HIGH);
    digitalWrite(kLotoShuntRelayPin, HIGH);
    digitalWrite(kLotoTimerRelayPin, HIGH);
    digitalWrite(kPilotLightPin, HIGH);
}

void setup() {
    Serial.begin(kSerialBaudRate);
    Serial.println("[E-Lock] Field Controller Initializing...");

    pinMode(kLotoMainRelayPin, OUTPUT);
    pinMode(kLotoShuntRelayPin, OUTPUT);
    pinMode(kLotoTimerRelayPin, OUTPUT);
    pinMode(kPilotLightPin, OUTPUT);
    pinMode(kLotoBypassButtonPin, INPUT_PULLUP);
    pinMode(kLotoZmptPin, INPUT);

    setRelaysHigh();

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
    if (lotoCommandReceived) {
        lotoCommandReceived = false;
        if (pendingCommand == LotoState::kDelay && currentLotoState == LotoState::kStandby) {
            currentLotoState = LotoState::kDelay;
            lotoStateStartMs = millis();
            Serial.println("[E-Lock] LOTO START - 10s delay");
        } else if (pendingCommand == LotoState::kStandby) {
            currentLotoState = LotoState::kStandby;
            setRelaysHigh();
            Serial.println("[E-Lock] LOTO STOP - returning to standby");
        }
    }

    if (currentLotoState == LotoState::kTripped && digitalRead(kLotoBypassButtonPin) == LOW) {
        delay(50);
        if (digitalRead(kLotoBypassButtonPin) == LOW) {
            currentLotoState = LotoState::kStandby;
            setRelaysHigh();
            Serial.println("[E-Lock] Bypass pressed - returning to standby");
            while (digitalRead(kLotoBypassButtonPin) == LOW) {
                delay(10);
            }
        }
    }

    switch (currentLotoState) {
        case LotoState::kStandby:
            break;

        case LotoState::kDelay:
            if (millis() - lotoStateStartMs >= kLotoDelayDurationMs) {
                digitalWrite(kLotoMainRelayPin, LOW);
                digitalWrite(kPilotLightPin, LOW);
                currentLotoState = LotoState::kMonitoring;
                lotoStateStartMs = millis();
                Serial.println("[E-Lock] LOTO power cut - monitoring");
            }
            break;

        case LotoState::kMonitoring:
            if (analogRead(kLotoZmptPin) > kLotoVoltageThreshold) {
                digitalWrite(kLotoShuntRelayPin, LOW);
                digitalWrite(kLotoTimerRelayPin, LOW);
                currentLotoState = LotoState::kTripped;
                Serial.println("[E-Lock] LOTO TRIPPED - voltage detected");
            }
            break;

        case LotoState::kTripped:
            break;
    }

    delay(50);
}
