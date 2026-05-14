#include "buzzer-led.h"
#include <Arduino.h>

BuzzerLed::BuzzerLed(uint8_t buzzerPin, uint8_t ledGreenPin, uint8_t ledRedPin)
    : m_buzzerPin(buzzerPin), m_ledGreenPin(ledGreenPin), m_ledRedPin(ledRedPin) {}

void BuzzerLed::begin() {
    pinMode(m_buzzerPin, OUTPUT);
    pinMode(m_ledGreenPin, OUTPUT);
    pinMode(m_ledRedPin, OUTPUT);
    digitalWrite(m_ledGreenPin, LOW);
    digitalWrite(m_ledRedPin, LOW);
}

void BuzzerLed::signalSuccess() {
    setLed(true, true);
    beep(2000, 200);
    delay(300);
    setLed(true, false);
}

void BuzzerLed::signalFailure() {
    setLed(false, true);
    beep(500, 500);
    delay(300);
    beep(500, 500);
    delay(300);
    setLed(false, false);
}

void BuzzerLed::signalWarning() {
    setLed(true, true);
    setLed(false, true);
    beep(1000, 300);
    delay(200);
    setLed(true, false);
    setLed(false, false);
}

void BuzzerLed::beep(uint16_t frequencyHz, uint32_t durationMs) {
    tone(m_buzzerPin, frequencyHz, durationMs);
    delay(durationMs);
    noTone(m_buzzerPin);
}

void BuzzerLed::setLed(bool isGreen, bool isOn) {
    uint8_t targetPin = isGreen ? m_ledGreenPin : m_ledRedPin;
    digitalWrite(targetPin, isOn ? HIGH : LOW);
}
