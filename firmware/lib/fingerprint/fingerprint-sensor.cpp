#include "fingerprint-sensor.h"
#include "constants.h"

FingerprintSensor::FingerprintSensor(HardwareSerial& serial, uint8_t rxPin, uint8_t txPin)
    : m_sensor(&serial), m_rxPin(rxPin), m_txPin(txPin) {}

bool FingerprintSensor::begin() {
    m_sensor.begin(kFingerprintBaudRate);
    return m_sensor.verifyPassword();
}

AuthResult FingerprintSensor::authenticate() {
    // TODO: Implement fingerprint scan + match logic
    return AuthResult::kFailed;
}

bool FingerprintSensor::enrollFingerprint(uint16_t fingerprintId) {
    // TODO: Implement two-step enrollment flow
    return false;
}

bool FingerprintSensor::deleteFingerprint(uint16_t fingerprintId) {
    return m_sensor.deleteModel(fingerprintId) == FINGERPRINT_OK;
}

bool FingerprintSensor::deleteAllFingerprints() {
    return m_sensor.emptyDatabase() == FINGERPRINT_OK;
}

uint16_t FingerprintSensor::getEnrolledCount() {
    m_sensor.getTemplateCount();
    return m_sensor.templateCount;
}
