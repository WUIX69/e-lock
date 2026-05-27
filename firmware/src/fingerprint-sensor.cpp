#include "fingerprint-sensor.h"
#include "config.h"
#include "constants.h"
#include <Arduino.h>
#include <Adafruit_Fingerprint.h>

FingerprintSensor::FingerprintSensor(HardwareSerial& serial, uint8_t rxPin, uint8_t txPin)
    : m_serial(serial), m_rxPin(rxPin), m_txPin(txPin), m_finger(nullptr),
      m_enrollStep(EnrollStep::kIdle), m_enrollId(0),
      m_enrollTrials(3), m_lastError(0), m_trialFailed(false) {}

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
    Serial.printf("[E-Lock] Using legacy single-scan enroll for ID %d (not recommended)\n", id);
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

bool FingerprintSensor::checkTrialFailed(uint8_t& trialNum, uint8_t& errorCode) {
    if (!m_trialFailed) {
        return false;
    }
    m_trialFailed = false;
    trialNum = 3 - m_enrollTrials;
    errorCode = m_lastError;
    return true;
}

void FingerprintSensor::startEnroll(uint16_t id) {
    m_enrollId = id;
    m_enrollStep = EnrollStep::kNeedFirstFinger;
    m_enrollTrials = 3;
    m_lastError = 0;
    m_trialFailed = false;
    Serial.printf("[E-Lock] Enrollment started for ID %d. Place finger on sensor.\n", id);
}

void FingerprintSensor::cancelEnroll() {
    m_enrollStep = EnrollStep::kIdle;
    m_enrollId = 0;
    Serial.println("[E-Lock] Enrollment cancelled");
}

void FingerprintSensor::handleTrialFailure(uint8_t error) {
    if (m_enrollTrials > 0) {
        m_enrollTrials--;
    }
    m_lastError = error;
    m_trialFailed = true;
    Serial.printf("[E-Lock] Trial failed. Trials left: %d, error: %d\n", m_enrollTrials, error);
    if (m_enrollTrials == 0) {
        Serial.println("[E-Lock] No trials left. Enrollment failed.");
        m_enrollStep = EnrollStep::kFailed;
    }
}

EnrollStep FingerprintSensor::enrollStep() {
    if (m_enrollStep == EnrollStep::kIdle || m_enrollStep == EnrollStep::kSuccess || m_enrollStep == EnrollStep::kFailed) {
        return m_enrollStep;
    }

    uint8_t p;

    switch (m_enrollStep) {
        case EnrollStep::kNeedFirstFinger: {
            p = m_finger->getImage();
            if (p == FINGERPRINT_OK) {
                Serial.println("[E-Lock] First scan captured");
                p = m_finger->image2Tz(1);
                if (p == FINGERPRINT_OK) {
                    Serial.println("[E-Lock] First template created");
                    m_enrollStep = EnrollStep::kNeedRemoveFinger;
                } else {
                    handleTrialFailure(p);
                }
            } else if (p != FINGERPRINT_NOFINGER) {
                handleTrialFailure(p);
            }
            break;
        }

        case EnrollStep::kNeedRemoveFinger: {
            p = m_finger->getImage();
            if (p == FINGERPRINT_NOFINGER) {
                Serial.println("[E-Lock] Finger removed. Place same finger again.");
                m_enrollStep = EnrollStep::kNeedSecondFinger;
            }
            break;
        }

        case EnrollStep::kNeedSecondFinger: {
            p = m_finger->getImage();
            if (p == FINGERPRINT_OK) {
                Serial.println("[E-Lock] Second scan captured");
                p = m_finger->image2Tz(2);
                if (p == FINGERPRINT_OK) {
                    Serial.println("[E-Lock] Second template created");
                    m_enrollStep = EnrollStep::kCreatingModel;
                } else {
                    handleTrialFailure(p);
                }
            } else if (p != FINGERPRINT_NOFINGER) {
                handleTrialFailure(p);
            }
            break;
        }

        case EnrollStep::kCreatingModel: {
            p = m_finger->createModel();
            if (p != FINGERPRINT_OK) {
                Serial.printf("[E-Lock] Create model error: %d\n", p);
                handleTrialFailure(p);
                if (m_enrollStep != EnrollStep::kFailed) {
                    m_enrollStep = EnrollStep::kNeedFirstFinger;
                    Serial.println("[E-Lock] Retrying enrollment from first scan");
                }
                break;
            }

            p = m_finger->storeModel(m_enrollId);
            if (p != FINGERPRINT_OK) {
                Serial.printf("[E-Lock] Store model error: %d\n", p);
                handleTrialFailure(p);
                if (m_enrollStep != EnrollStep::kFailed) {
                    m_enrollStep = EnrollStep::kNeedFirstFinger;
                    Serial.println("[E-Lock] Retrying enrollment from first scan");
                }
                break;
            }

            Serial.printf("[E-Lock] Fingerprint ID %d enrolled successfully\n", m_enrollId);
            m_enrollStep = EnrollStep::kSuccess;
            break;
        }

        default:
            break;
    }

    return m_enrollStep;
}
