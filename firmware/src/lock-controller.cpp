#include "lock-controller.h"
#include <Arduino.h>

LockController::LockController(uint8_t relayPin)
    : m_relayPin(relayPin), m_state(LockState::kLocked) {}

void LockController::begin() {
    pinMode(m_relayPin, OUTPUT);
    digitalWrite(m_relayPin, HIGH);
    m_state = LockState::kLocked;
}

void LockController::lock() {
    digitalWrite(m_relayPin, HIGH);
    m_state = LockState::kLocked;
}

void LockController::unlock() {
    digitalWrite(m_relayPin, LOW);
    m_state = LockState::kUnlocked;
}

LockState LockController::getState() {
    return m_state;
}
