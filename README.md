# E-Lock — IoT LOTO Safety System

A full-stack Lock-Out/Tag-Out (LOTO) safety system combining a **Next.js web dashboard** with **ESP32 firmware** for biometric-authenticated industrial machine lockout.

## Project Structure

```text
e-lock/
├── web/          # Next.js 16 Web Dashboard (TypeScript, Tailwind, Shadcn, Drizzle)
├── firmware/     # ESP32 PlatformIO Firmware (C++, MQTT, Fingerprint Sensor)
├── docs/         # Architecture, API contracts, hardware schematics
└── .agent/       # AI agent rules, skills, and workflows (ECC)
```

## Tech Stack

| Layer             | Technology                                                                |
| ----------------- | ------------------------------------------------------------------------- |
| **Frontend**      | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Shadcn UI |
| **Database**      | PostgreSQL, Drizzle ORM                                                   |
| **Auth**          | Custom plain auth (session-based)                                         |
| **Firmware**      | ESP32 (PlatformIO), C++17, Arduino framework                              |
| **Communication** | MQTT (PubSubClient), ESP-NOW (optional)                                   |
| **Sensors**       | Adafruit Fingerprint Sensor, Solenoid Lock, OLED Display, Buzzer/LED      |

## Core Features & Workflows

The web dashboard is divided into distinct roles to manage the LOTO process effectively:

### 👷 User Workflows

- **Node Operations:** Users can browse and select a specific node (device) to submit tasks such as general records, maintenance logs, or repair requests.
- **Collaborative Maintenance:** When submitting a task on a node, users can invite another user to co-perform the task, ensuring multi-person lockout accountability.

### 🛡️ Admin Workflows

- **Task Monitoring:** Admins have a global view of all submitted records, maintenance, and repair tasks across every node in the facility.
- **Device Management:** Admins can provision and add new node devices to the system's active list as the physical hardware network expands.

## Architecture

The system follows **Feature-Sliced Design (FSD)** on the web side and **modular library architecture** on the firmware side. See [docs/SYSTEM-OVERVIEW.md](docs/SYSTEM-OVERVIEW.md) for details.

## Getting Started

### Web Dashboard

```bash
cd web
pnpm install
pnpm dev
```

### Firmware

Requires [PlatformIO CLI](https://platformio.org/install/cli) or the VS Code PlatformIO extension.

```bash
cd firmware
pio run          # Build
pio run -t upload  # Flash to ESP32
pio device monitor # Serial monitor
```

## Documentation

- [System Overview & LOTO Specifications](docs/E-LOCK.md)
- [Developer Onboarding & Contributing Guide](docs/CONTRIBUTING.md)
- [Environment Variables Setup](docs/ENV.md)
- [Operations & Runbook Guide](docs/RUNBOOK.md)
- [System Architecture](docs/SYSTEM-OVERVIEW.md)
- [MQTT Topic Contracts](docs/MQTT-TOPICS.md)
- [Hardware Wiring Diagram](docs/WIRING-DIAGRAM.md)
- [PlatformIO Antigravity IDE Fix](docs/PLARFORM-IO-FIX-ANTIGRAVITY.md)
