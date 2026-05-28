#include "mqtt-handler.h"
#include "config.h"
#include "constants.h"
#include <WiFi.h>
#include <WiFiClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Arduino.h>
#include <memory>

MqttHandler* MqttHandler::s_instance = nullptr;

MqttHandler::MqttHandler(WiFiClient& client, const char* host, uint16_t port)
    : m_client(client), m_host(host), m_port(port), m_callback(nullptr),
      m_clientId(nullptr), m_username(nullptr), m_password(nullptr), m_lastReconnectAttempt(0) {
    m_mqtt.reset(new PubSubClient(client));
    m_mqtt->setServer(m_host, m_port);
    m_mqtt->setBufferSize(512);
    m_mqtt->setCallback(staticCallback);
}

MqttHandler::~MqttHandler() {
    if (s_instance == this) {
        s_instance = nullptr;
    }
}

bool MqttHandler::begin(const char* clientId, const char* username, const char* password) {
    m_clientId = clientId;
    m_username = username;
    m_password = password;
    m_lastReconnectAttempt = 0;

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[E-Lock] WiFi offline. Deferring MQTT setup.");
        return false;
    }

    if (m_mqtt->connected()) {
        m_mqtt->disconnect();
    }

    bool connected = m_mqtt->connect(m_clientId, m_username, m_password);
    if (connected) {
        Serial.printf("[E-Lock] MQTT connected to %s:%d as %s\n", m_host, m_port, m_clientId);
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
    if (WiFi.status() != WL_CONNECTED) {
        return;
    }

    if (!m_mqtt->connected()) {
        uint32_t now = millis();
        if (now - m_lastReconnectAttempt >= kMqttReconnectIntervalMs) {
            m_lastReconnectAttempt = now;
            Serial.println("[E-Lock] Attempting non-blocking MQTT reconnection...");
            if (m_mqtt->connect(m_clientId, m_username, m_password)) {
                Serial.println("[E-Lock] MQTT reconnected successfully!");
                m_mqtt->subscribe(kMqttTopicCommand);

                JsonDocument statusDoc;
                statusDoc["event"] = "online";
                statusDoc["state"] = "connected";
                char statusBuf[128];
                serializeJson(statusDoc, statusBuf);
                m_mqtt->publish(kMqttTopicStatus, statusBuf);
            } else {
                Serial.printf("[E-Lock] MQTT reconnect failed (rc=%d)\n", m_mqtt->state());
            }
        }
    } else {
        m_mqtt->loop();
    }
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
