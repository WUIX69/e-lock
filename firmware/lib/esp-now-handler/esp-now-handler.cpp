#include "esp-now-handler.h"
#include <esp_now.h>
#include <WiFi.h>

bool EspNowHandler::begin() {
    WiFi.mode(WIFI_STA);
    return esp_now_init() == ESP_OK;
}

bool EspNowHandler::addPeer(const uint8_t* macAddress) {
    esp_now_peer_info_t peerInfo = {};
    memcpy(peerInfo.peer_addr, macAddress, 6);
    peerInfo.channel = 0;
    peerInfo.encrypt = false;
    return esp_now_add_peer(&peerInfo) == ESP_OK;
}

bool EspNowHandler::send(const uint8_t* macAddress, const uint8_t* data, size_t dataLength) {
    return esp_now_send(macAddress, data, dataLength) == ESP_OK;
}

void EspNowHandler::onReceive(EspNowReceiveCallback callback) {
    m_callback = callback;
}
