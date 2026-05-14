#include "display-manager.h"

DisplayManager::DisplayManager(uint8_t sdaPin, uint8_t sclPin)
    : m_sdaPin(sdaPin), m_sclPin(sclPin) {}

bool DisplayManager::begin() {
    // TODO: Initialize OLED display (SSD1306 or similar)
    return false;
}

void DisplayManager::clear() {
    // TODO: Clear display buffer
}

void DisplayManager::showStatus(const char* line1, const char* line2) {
    // TODO: Render status text on display
}

void DisplayManager::showAuthResult(bool isSuccess, const char* message) {
    // TODO: Show auth result with icon
}
