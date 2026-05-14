#pragma once

#include <cstdint>
#include "types.h"

class LockController {
public:
    explicit LockController(uint8_t relayPin);

    void begin();
    void lock();
    void unlock(uint32_t durationMs);
    LockState getState() const;

private:
    uint8_t m_relayPin;
    LockState m_currentState;
};
