#pragma once

#include <cstdint>

class DisplayManager {
public:
    DisplayManager(uint8_t sdaPin, uint8_t sclPin);

    bool begin();
    void clear();
    void showStatus(const char* line1, const char* line2 = nullptr);
    void showAuthResult(bool isSuccess, const char* message);

private:
    uint8_t m_sdaPin;
    uint8_t m_sclPin;
};
