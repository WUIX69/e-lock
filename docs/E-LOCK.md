# E-LOCK: Automated Lockout/Tagout (LOTO) System

**Integrating Wireless Relays and Biometric Authentication for Secure Electrical Isolation**

---

## 1. Project Overview

E-LOCK is a modern, IoT-enabled Lockout/Tagout (LOTO) safety system designed for high-risk industrial environments. Traditional LOTO systems rely on manual management of physical padlocks and tags, which are highly susceptible to human error, procedural delays, and miscommunications.

E-LOCK addresses these systemic vulnerabilities by digitizing the authorization process and automating physical electrical isolation. By integrating ESP32 microcontrollers, biometric scanners, and shunt trip circuit breakers, the system ensures that machinery is completely de-energized and can only be restored after verified physical presence and digital clearance.

---

## 2. Key Features

- **Biometric Authorization & RBAC:** Industrial equipment is protected by non-transferable fingerprint verification using the AS608 scanner, with strict Role-Based Access Control separating Admin and Employee privileges.

- **Transient-Filtered Failsafe:** If the LOTO relay faults, the ZMPT101B Voltage Sensor detects the anomaly and signals the Time Delay Relay (TDR) to isolate the load. Simultaneously, the ESP32 energizes the shunt relay to trip the circuit breaker before the TDR releases the current.

- **Mechanical Override (Shunt Trip):** The ultimate physical fail-safe. If the system commands a shutdown but power remains (e.g., due to a welded relay), the hardware-level feedback loop ensures the ESP32 forces the Main Circuit Breaker into the OFF position.

- **High-Speed Wireless Response:** Uses ESP-NOW for instant hardware-to-hardware communication between nodes, bypassing the need for a local Wi-Fi router for critical safety commands.

- **Live Dashboard & Auditing:** A centralized Next.js web interface tracks real-time isolation status and maintains an automated, tamper-proof audit trail in a PostgreSQL database.

---

## 3. User Interface & Access Flow (Dashboard Logic)

The system enforces strict security right from the initial interaction. The entry point immediately requests a fingerprint scan.

### A. Admin / Supervisor Flow

If an Admin fingerprint is detected, the dashboard provides oversight and management tools:

1. **Logs (Monitor):** View the complete, real-time audit trail of all LOTO events.
2. **Registration (Input New Worker’s Data):**
   - Employee Name
   - Secure PIN
   - Fingerprint Data

### B. Employee Flow

If an Employee fingerprint is detected, access is restricted to operational safety tools:

1. **Maintenance:** Initiates the LOTO sequence to de-energize specific machinery for safe servicing.
2. **Monitoring:** Displays the real-time electrical status of assigned machinery.

### C. Fallback Security Mechanism

For any fingerprint-based action:

- **3-Attempt Limit:** If scanning fails 3 consecutive times, the scanner locks and requests the user’s registered PIN as a fallback.

---

## 4. Technology Stack

### Web Dashboard (FSD Architecture)

- **Framework:** Next.js (App Router)
- **UI/UX:** Shadcn UI & TailwindCSS
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Communication:** MQTT (Hardware to Server) / WebSockets (Server to Client)

### Firmware & Embedded

- **Environment:** PlatformIO (VS Code)
- **Microcontrollers:** Dual ESP32 Setup (Gateway & Field Controller)
- **Protocols:** ESP-NOW and Wi-Fi/MQTT
- **Language:** C++

---

## 5. System Architecture (Hardware Nodes)

1. **Gateway (ESP32 #1):**
   - Handles AS608 biometric scanning
   - Checks roles
   - Broadcasts commands via ESP-NOW
   - Logs events to PostgreSQL

2. **Field Controller (ESP32 #2):**
   - Receives commands
   - Toggles control relays
   - Cuts machinery power

3. **Feedback Loop & Failsafe:**
   - ZMPT101B monitors load side
   - Detects shutdown failure
   - TDR signals ESP32 #2
   - ESP32 #2 triggers shunt trip for breaker isolation

---

## 6. Project Structure (Feature-Sliced Design)

```plaintext
E-LOCK/
├── web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── employee/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── config/
│   │   ├── db/
│   │   ├── features/
│   │   │   ├── loto-status/
│   │   │   ├── user-mgmt/
│   │   │   └── logs/
│   │   └── types/
├── firmware/
│   ├── src/
│   │   ├── main.cpp
│   │   ├── gateway.cpp
│   │   ├── field_controller.cpp
│   │   └── failsafe.cpp
│   ├── lib/
│   └── platformio.ini
└── docs/
```

---

## 7. Significance of the Study

- **Workforce Protection:** Prevents accidental start-ups by verifying physical presence through biometric authentication.
- **Safety Compliance:** Replaces manual logs with automated, real-time records.
- **Future Innovation:** Establishes a blueprint for Industrial Internet of Things (IIoT) safety infrastructures.
