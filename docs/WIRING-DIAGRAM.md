# ESP32 Wiring Diagram

## Pin Assignment Table

| Component | Pin Function | ESP32 GPIO | Notes |
|-----------|-------------|------------|-------|
| Fingerprint Sensor RX | UART2 RX | GPIO 16 | Connect to sensor TX |
| Fingerprint Sensor TX | UART2 TX | GPIO 17 | Connect to sensor RX |
| Lock Relay | Digital Output | GPIO 27 | Active HIGH to unlock |
| Buzzer | PWM Output | GPIO 25 | Piezo buzzer |
| LED Green | Digital Output | GPIO 32 | Success indicator |
| LED Red | Digital Output | GPIO 33 | Failure indicator |
| OLED SDA | I2C Data | GPIO 21 | SSD1306 display |
| OLED SCL | I2C Clock | GPIO 22 | SSD1306 display |

## Power Requirements

| Component | Voltage | Current (typical) |
|-----------|---------|-------------------|
| ESP32 DevKit | 5V USB / 3.3V | ~240mA |
| Fingerprint Sensor | 3.3V | ~60mA |
| Solenoid Lock | 12V | ~500mA (requires relay) |
| SSD1306 OLED | 3.3V | ~20mA |
| Piezo Buzzer | 3.3V | ~30mA |
| LEDs | 3.3V | ~20mA each |

## Connection Notes

- The solenoid lock requires a **relay module** (5V or 12V) driven by GPIO 27. Do NOT drive the solenoid directly from the ESP32.
- Fingerprint sensor communicates over UART2 at 57600 baud.
- OLED display communicates over I2C (address 0x3C typically).
- Add a **flyback diode** across the solenoid to protect the relay from voltage spikes.
- Use a **common ground** between the ESP32, relay module, and power supply.

## Schematic

> TODO: Add KiCad or Fritzing schematic image here once hardware design is finalized.
