#include "esp-now-handler.h"
#include <esp_now.h>
#include <WiFi.h>

EspNowHandler* EspNowHandler::s_instance = nullptr;

EspNowHandler::EspNowHandler() : m_callback(nullptr) {
    s_instance = this;
}

EspNowHandler::~EspNowHandler() {
    if (s_instance == this) {
        s_instance = nullptr;
    }
}

bool EspNowHandler::begin() {
    WiFi.mode(WIFI_STA);
    if (esp_now_init() != ESP_OK) {
        return false;
    }
    esp_now_register_recv_cb(staticReceiveCallback);
    return true;
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

void EspNowHandler::staticReceiveCallback(const uint8_t* mac, const uint8_t* incomingData, int len) {
    if (s_instance && s_instance->m_callback) {
        s_instance->m_callback(mac, incomingData, len);
    }
}
