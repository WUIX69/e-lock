#include "lock-controller.h"
#include <Arduino.h>

LockController::LockController(uint8_t relayPin)
    : m_relayPin(relayPin), m_currentState(LockState::kLocked) {}

void LockController::begin() {
    pinMode(m_relayPin, OUTPUT);
    lock();
}

void LockController::lock() {
    digitalWrite(m_relayPin, LOW);
    m_currentState = LockState::kLocked;
}

void LockController::unlock(uint32_t durationMs) {
    digitalWrite(m_relayPin, HIGH);
    m_currentState = LockState::kUnlocked;
    // HACK: blocking delay for safety — ensures lock re-engages
    delay(durationMs);
    lock();
}

LockState LockController::getState() const {
    return m_currentState;
}
