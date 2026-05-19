#pragma once

#include "types.h"
#include <cstdint>

class HardwareSerial;
class Adafruit_Fingerprint;

class FingerprintSensor {
public:
    FingerprintSensor(HardwareSerial& serial, uint8_t rxPin, uint8_t txPin);
    ~FingerprintSensor();

    bool begin();
    AuthResult scan(uint16_t& fingerprintId);
    bool enroll(uint16_t id);
    uint16_t getEnrolledCount();

private:
    HardwareSerial& m_serial;
    Adafruit_Fingerprint* m_finger;
    uint8_t m_rxPin;
    uint8_t m_txPin;
};
