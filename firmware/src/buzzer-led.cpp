#include "buzzer-led.h"
#include <Arduino.h>

BuzzerLed::BuzzerLed(uint8_t buzzerPin, uint8_t ledGreenPin, uint8_t ledRedPin)
    : m_buzzerPin(buzzerPin), m_ledGreenPin(ledGreenPin), m_ledRedPin(ledRedPin) {}

void BuzzerLed::begin() {
    pinMode(m_buzzerPin, OUTPUT);
    pinMode(m_ledGreenPin, OUTPUT);
    pinMode(m_ledRedPin, OUTPUT);
    setIdle();
}

void BuzzerLed::signalSuccess() {
    setLed(true, false);
    beep(100);
    delay(100);
    beep(100);
}

void BuzzerLed::signalFailure() {
    setLed(false, true);
    beep(500);
}

void BuzzerLed::signalWarning() {
    for (int i = 0; i < 3; i++) {
        setLed(true, true);
        beep(150);
        delay(150);
    }
    setIdle();
}

void BuzzerLed::setIdle() {
    setLed(false, false);
    digitalWrite(m_buzzerPin, LOW);
}

void BuzzerLed::beep(uint16_t durationMs) {
    digitalWrite(m_buzzerPin, HIGH);
    delay(durationMs);
    digitalWrite(m_buzzerPin, LOW);
}

void BuzzerLed::setLed(bool green, bool red) {
    digitalWrite(m_ledGreenPin, green ? HIGH : LOW);
    digitalWrite(m_ledRedPin, red ? HIGH : LOW);
}
