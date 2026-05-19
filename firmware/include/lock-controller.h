#pragma once

#include "types.h"
#include <cstdint>

class LockController {
public:
    explicit LockController(uint8_t relayPin);
    void begin();
    void lock();
    void unlock();
    LockState getState();

private:
    uint8_t m_relayPin;
    LockState m_state;
};
