#pragma once

#include <PubSubClient.h>
#include <WiFiClient.h>
#include <functional>

using MqttMessageCallback = std::function<void(const char* topic, const char* payload)>;

class MqttHandler {
public:
    MqttHandler(WiFiClient& wifiClient, const char* brokerHost, uint16_t brokerPort);

    void begin(const char* clientId, const char* username, const char* password);
    void loop();
    bool isConnected() const;
    bool publish(const char* topic, const char* payload, bool retained = false);
    bool subscribe(const char* topic);
    void onMessage(MqttMessageCallback callback);

private:
    PubSubClient m_client;
    const char* m_clientId;
    const char* m_username;
    const char* m_password;
    MqttMessageCallback m_callback;

    bool reconnect();
};
