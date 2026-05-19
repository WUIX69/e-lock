#include "mqtt-handler.h"
#include "config.h"
#include "constants.h"
#include <WiFiClient.h>
#include <PubSubClient.h>
#include <Arduino.h>

MqttHandler* MqttHandler::s_instance = nullptr;

MqttHandler::MqttHandler(WiFiClient& client, const char* host, uint16_t port)
    : m_client(client), m_host(host), m_port(port), m_callback(nullptr) {
    m_mqtt = new PubSubClient(client);
    m_mqtt->setServer(m_host, m_port);
    m_mqtt->setBufferSize(512);
    m_mqtt->setCallback(staticCallback);
}

MqttHandler::~MqttHandler() {
    if (s_instance == this) {
        s_instance = nullptr;
    }
    delete m_mqtt;
}

bool MqttHandler::begin(const char* clientId, const char* username, const char* password) {
    if (m_mqtt->connected()) {
        m_mqtt->disconnect();
    }

    bool connected = m_mqtt->connect(clientId, username, password);
    if (connected) {
        Serial.printf("[E-Lock] MQTT connected to %s:%d as %s\n", m_host, m_port, clientId);
    } else {
        Serial.printf("[E-Lock] MQTT connection FAILED (rc=%d)\n", m_mqtt->state());
    }

    return connected;
}

bool MqttHandler::subscribe(const char* topic) {
    return m_mqtt->subscribe(topic);
}

bool MqttHandler::publish(const char* topic, const char* payload) {
    return m_mqtt->publish(topic, payload);
}

void MqttHandler::loop() {
    if (!m_mqtt->connected()) {
        m_mqtt->connect(kMqttClientId, kMqttUsername, kMqttPassword);
    }
    m_mqtt->loop();
}

void MqttHandler::onMessage(MessageCallback callback) {
    m_callback = callback;
    s_instance = this;
}

bool MqttHandler::isConnected() {
    return m_mqtt->connected();
}

void MqttHandler::staticCallback(char* topic, unsigned char* payload, unsigned int length) {
    if (s_instance && s_instance->m_callback) {
        char buf[256];
        unsigned int len = length < sizeof(buf) - 1 ? length : sizeof(buf) - 1;
        memcpy(buf, payload, len);
        buf[len] = '\0';
        s_instance->m_callback(topic, buf);
    }
}
