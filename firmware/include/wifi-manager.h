#pragma once

#include <cstdint>

class WifiManager {
public:
    WifiManager(const char* ssid, const char* password);
    bool connect(uint32_t timeoutMs);
    const char* getLocalIp();

private:
    const char* m_ssid;
    const char* m_password;
    bool m_connected;
};
