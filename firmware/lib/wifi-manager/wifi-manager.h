#pragma once

#include <cstdint>

class WifiManager {
public:
    WifiManager(const char* ssid, const char* password);

    bool connect(uint32_t timeoutMs);
    bool isConnected() const;
    void disconnect();
    const char* getLocalIp() const;

private:
    const char* m_ssid;
    const char* m_password;
};
