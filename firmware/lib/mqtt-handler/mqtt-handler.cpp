#include "mqtt-handler.h"
#include "constants.h"

MqttHandler::MqttHandler(WiFiClient& wifiClient, const char* brokerHost, uint16_t brokerPort)
    : m_client(wifiClient), m_clientId(nullptr), m_username(nullptr), m_password(nullptr) {
    m_client.setServer(brokerHost, brokerPort);
}

void MqttHandler::begin(const char* clientId, const char* username, const char* password) {
    m_clientId = clientId;
    m_username = username;
    m_password = password;

    m_client.setCallback([this](char* topic, byte* payload, unsigned int length) {
        if (!m_callback) {
            return;
        }
        char buffer[256];
        uint16_t safeLength = (length < sizeof(buffer) - 1) ? length : sizeof(buffer) - 1;
        memcpy(buffer, payload, safeLength);
        buffer[safeLength] = '\0';
        m_callback(topic, buffer);
    });
}

void MqttHandler::loop() {
    if (!m_client.connected()) {
        reconnect();
    }
    m_client.loop();
}

bool MqttHandler::isConnected() const {
    return m_client.connected();
}

bool MqttHandler::publish(const char* topic, const char* payload, bool retained) {
    return m_client.publish(topic, payload, retained);
}

bool MqttHandler::subscribe(const char* topic) {
    return m_client.subscribe(topic);
}

void MqttHandler::onMessage(MqttMessageCallback callback) {
    m_callback = callback;
}

bool MqttHandler::reconnect() {
    if (m_client.connected()) {
        return true;
    }
    return m_client.connect(m_clientId, m_username, m_password);
}
