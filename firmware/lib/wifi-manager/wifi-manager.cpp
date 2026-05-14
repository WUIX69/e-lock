#include "wifi-manager.h"
#include <WiFi.h>

WifiManager::WifiManager(const char* ssid, const char* password)
    : m_ssid(ssid), m_password(password) {}

bool WifiManager::connect(uint32_t timeoutMs) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(m_ssid, m_password);

    uint32_t startTime = millis();
    while (WiFi.status() != WL_CONNECTED) {
        if (millis() - startTime > timeoutMs) {
            return false;
        }
        delay(500);
    }
    return true;
}

bool WifiManager::isConnected() const {
    return WiFi.status() == WL_CONNECTED;
}

void WifiManager::disconnect() {
    WiFi.disconnect();
}

const char* WifiManager::getLocalIp() const {
    static char ipBuffer[16];
    WiFi.localIP().toString().toCharArray(ipBuffer, sizeof(ipBuffer));
    return ipBuffer;
}
