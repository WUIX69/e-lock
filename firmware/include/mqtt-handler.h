#pragma once

#include <cstdint>
#include <functional>

#include <Arduino.h>

class WiFiClient;
class PubSubClient;

class MqttHandler {
public:
    using MessageCallback = std::function<void(const char*, const char*)>;

    MqttHandler(WiFiClient& client, const char* host, uint16_t port);
    ~MqttHandler();

    bool begin(const char* clientId, const char* username, const char* password);
    bool subscribe(const char* topic);
    bool publish(const char* topic, const char* payload);
    void loop();
    void onMessage(MessageCallback callback);
    bool isConnected();

    static MqttHandler* s_instance;

private:
    static void staticCallback(char* topic, unsigned char* payload, unsigned int length);

    WiFiClient& m_client;
    PubSubClient* m_mqtt;
    const char* m_host;
    uint16_t m_port;
    MessageCallback m_callback;
};
