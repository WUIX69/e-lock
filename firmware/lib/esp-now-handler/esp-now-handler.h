#pragma once

#include <cstdint>
#include <functional>

using EspNowReceiveCallback = std::function<void(const uint8_t* macAddress, const uint8_t* data, int dataLength)>;

class EspNowHandler {
public:
    EspNowHandler();
    ~EspNowHandler();

    bool begin();
    bool addPeer(const uint8_t* macAddress);
    bool send(const uint8_t* macAddress, const uint8_t* data, size_t dataLength);
    void onReceive(EspNowReceiveCallback callback);

    static EspNowHandler* s_instance;

private:
    static void staticReceiveCallback(const uint8_t* mac, const uint8_t* incomingData, int len);
    EspNowReceiveCallback m_callback;
};
