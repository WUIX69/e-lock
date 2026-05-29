# PROJECT CONSTRUCTION

## FOR BIOMETRIC

### AS608 Fingerprint Scanner

The purpose of the AS608 fingerprint scanner is to act as the primary biometric authentication device, allowing workers to securely log in and have their identity verified by the system's microcontroller before they can initiate any electrical maintenance or repair procedures.

### ESP32 DevKit V1 #1

The purpose of ESP32 #1 is to verify the worker's scanned fingerprint against a database and, upon successful authentication and task input, transmit a signal to ESP32 #2 to initiate the lockout procedure.

---

## FOR AUTOMATED LOCKOUT/TAGOUT

### ESP32 DevKit V1 #2

ESP32 #2 functions as the automated lockout mechanism that actively cuts the main power supply during normal maintenance, while also acting as an emergency receiver that detects voltage faults and triggers the shunt trip breaker to guarantee a safe, zero-voltage state.

### Lithium-Ion Battery (3.7V 200 mAh)

The 3.7V, 2200mAh Lithium-Ion (Li-Ion) battery serves as the power source of the lock module.

### 4-Channel Relay Module

The 4-channel relay module acts as an electrically controlled switch that either cuts off the main power supply to protect workers during normal maintenance or routes power to trigger the emergency shunt trip breaker if a fault is detected.

### Time Delay Relay Module

The time delay relay serves as a buffer to ensure that power does not immediately reach the load in the event that Lockout/Tagout procedures fail.

### Voltage Sensor ZMPT101B

The ZMPT101B voltage sensor detects when unexpected voltage enters the system and triggers safety measures to prevent damage to components or the circuit breaker.

### Push Button

The push button serves as a bypass for the fail-safe system to maintain operation in the event that the relay fails.

### Shunt Trip Breaker

The shunt trip breaker allows remote tripping of the breaker via an external signal. When the voltage sensor detects a fault, it sends a signal to the ESP32, which then activates a relay to trigger the shunt trip.

### Miniature Circuit Breaker (MCB)

The miniature circuit breaker acts as an automated fail-safe mechanism that physically trips to isolate power from the load if the main relay experiences a fault, ensuring a secure, zero-voltage environment for workers during Lockout/Tagout (LOTO) procedures.

### Pilot Light

The pilot light is a small indicator light on the system box that shows whether a circuit is active.
