#include "wifi-manager.h"
#include "config.h"
#include <WiFi.h>

WifiManager::WifiManager(const char* ssid, const char* password)
    : m_ssid(ssid), m_password(password), m_connected(false) {}

bool WifiManager::connect(uint32_t timeoutMs) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(m_ssid, m_password);

    uint32_t start = millis();
    while (WiFi.status() != WL_CONNECTED) {
        if (millis() - start >= timeoutMs) {
            m_connected = false;
            return false;
        }
        delay(500);
    }

    m_connected = true;
    return true;
}

const char* WifiManager::getLocalIp() {
    static char ipStr[16];
    IPAddress ip = WiFi.localIP();
    sprintf(ipStr, "%d.%d.%d.%d", ip[0], ip[1], ip[2], ip[3]);
    return ipStr;
}
