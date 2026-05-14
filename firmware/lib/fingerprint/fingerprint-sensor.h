#pragma once

#include <Adafruit_Fingerprint.h>
#include "types.h"

class FingerprintSensor {
public:
    explicit FingerprintSensor(HardwareSerial& serial, uint8_t rxPin, uint8_t txPin);

    bool begin();
    AuthResult authenticate();
    bool enrollFingerprint(uint16_t fingerprintId);
    bool deleteFingerprint(uint16_t fingerprintId);
    bool deleteAllFingerprints();
    uint16_t getEnrolledCount();

private:
    Adafruit_Fingerprint m_sensor;
    uint8_t m_rxPin;
    uint8_t m_txPin;
};
