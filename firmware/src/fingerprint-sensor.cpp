#include "fingerprint-sensor.h"
#include "config.h"
#include "constants.h"
#include <Arduino.h>
#include <Adafruit_Fingerprint.h>

FingerprintSensor::FingerprintSensor(HardwareSerial& serial, uint8_t rxPin, uint8_t txPin)
    : m_serial(serial), m_rxPin(rxPin), m_txPin(txPin), m_finger(nullptr) {}

FingerprintSensor::~FingerprintSensor() {
    delete m_finger;
}

bool FingerprintSensor::begin() {
    m_serial.begin(kFingerprintBaudRate, SERIAL_8N1, m_rxPin, m_txPin);
    m_finger = new Adafruit_Fingerprint(&m_serial);

    if (!m_finger->verifyPassword()) {
        return false;
    }

    return true;
}

AuthResult FingerprintSensor::scan(uint16_t& fingerprintId) {
    uint8_t p = m_finger->getImage();

    if (p == FINGERPRINT_NOFINGER) {
        return AuthResult::kTimeout;
    }

    p = m_finger->image2Tz();
    if (p != FINGERPRINT_OK) {
        return AuthResult::kFailed;
    }

    p = m_finger->fingerSearch();
    if (p == FINGERPRINT_OK) {
        fingerprintId = m_finger->fingerID;
        return AuthResult::kSuccess;
    }

    if (p == FINGERPRINT_NOTFOUND) {
        return AuthResult::kNotEnrolled;
    }

    return AuthResult::kFailed;
}

bool FingerprintSensor::enroll(uint16_t id) {
    uint8_t p = m_finger->getImage();
    if (p != FINGERPRINT_OK) {
        return false;
    }

    p = m_finger->image2Tz(1);
    if (p != FINGERPRINT_OK) {
        return false;
    }

    p = m_finger->createModel();
    if (p != FINGERPRINT_OK) {
        return false;
    }

    p = m_finger->storeModel(id);
    if (p != FINGERPRINT_OK) {
        return false;
    }

    return true;
}

uint16_t FingerprintSensor::getEnrolledCount() {
    return m_finger->templateCount;
}
