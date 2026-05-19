#pragma once

#include <cstdint>

class BuzzerLed {
public:
    BuzzerLed(uint8_t buzzerPin, uint8_t ledGreenPin, uint8_t ledRedPin);
    void begin();
    void signalSuccess();
    void signalFailure();
    void signalWarning();
    void setIdle();

private:
    void beep(uint16_t durationMs);
    void setLed(bool green, bool red);

    uint8_t m_buzzerPin;
    uint8_t m_ledGreenPin;
    uint8_t m_ledRedPin;
};
