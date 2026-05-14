#pragma once

#include <cstdint>
#include <functional>

using EspNowReceiveCallback = std::function<void(const uint8_t* macAddress, const uint8_t* data, int dataLength)>;

class EspNowHandler {
public:
    EspNowHandler() = default;

    bool begin();
    bool addPeer(const uint8_t* macAddress);
    bool send(const uint8_t* macAddress, const uint8_t* data, size_t dataLength);
    void onReceive(EspNowReceiveCallback callback);

private:
    EspNowReceiveCallback m_callback;
};
