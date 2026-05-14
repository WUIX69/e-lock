#include <Arduino.h>
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

void handleMqttMessage(const char* topic, const char* payload) {
    // TODO: Handle incoming MQTT commands (remote unlock, enrollment mode, etc.)
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

    // TODO: Implement main loop logic
    // 1. Check fingerprint scan trigger
    // 2. Authenticate user
    // 3. Toggle lock based on auth result
    // 4. Publish status via MQTT
    // 5. Update display

    delay(100);
}
