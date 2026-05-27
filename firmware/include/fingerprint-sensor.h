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
    void startEnroll(uint16_t id);
    EnrollStep enrollStep();
    void cancelEnroll();
    uint16_t getEnrolledCount();

    EnrollStep getEnrollStep() const { return m_enrollStep; }
    uint8_t getEnrollTrials() const { return m_enrollTrials; }
    bool checkTrialFailed(uint8_t& trialNum, uint8_t& errorCode);

private:
    void handleTrialFailure(uint8_t error);
    HardwareSerial& m_serial;
    Adafruit_Fingerprint* m_finger;
    uint8_t m_rxPin;
    uint8_t m_txPin;
    EnrollStep m_enrollStep;
    uint16_t m_enrollId;
    uint8_t m_enrollTrials;
    uint8_t m_lastError;
    bool m_trialFailed;
};
