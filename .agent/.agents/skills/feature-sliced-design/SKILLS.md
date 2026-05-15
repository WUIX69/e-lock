# Feature Sliced Design (FSD) Architecture Guidelines

When developing features and adding new code to this project, you MUST strictly adhere to the Feature Sliced Design architecture and folder structure outlined below. This ensures mission-critical safety logic remains isolated, testable, and maintainable.

## 📂 Directory Structure Overview

The project is structured into global shared elements and isolated features, separated into a Next.js Web Dashboard and a PlatformIO C++ Firmware workspace:

```text
E-LOCK/
├── web/                             # Next.js Web Dashboard
│   ├── src/
│   │   ├── app/                     # App Router (Pages, Layouts, API Routes)
│   │   │   ├── (auth)/              # PIN fallback & secure login
│   │   │   └── (dashboard)/         # Admin & Employee RBAC routes
│   │   ├── components/              # Shared UI (Shadcn primitives, global layouts)
│   │   ├── config/                  # App-wide configuration (Env vars, MQTT topics)
│   │   ├── servers/                 # PostgreSQL Schema & Drizzle Migrations
│   │   ├── context/                 # Global React Contexts (Auth, Theme, MQTT)
│   │   ├── data/                    # Static constants (Roles, machine IDs)
│   │   ├── features/                # Domain-specific business logic (FSD)
│   │   ├── hooks/                   # Global custom hooks
│   │   ├── lib/                     # Library wrappers (Drizzle client, MQTT)
│   │   ├── types/                   # Global TypeScript definitions
│   │   └── utils/                   # Shared utility functions
├── firmware/                        # Hardware Implementation (C++)
│   ├── src/                         # ESP32 Source Code (Gateway & Field Controller)
│   ├── lib/                         # Hardware libraries (AS608, ZMPT101B)
│   └── platformio.ini               # PlatformIO build configuration
└── docs/                            # Design, CAD & Thesis Documentation

```

---

## 🌐 WEB Directory Structure

```text
web/
├── public/                          # Static assets (logos, icons)
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Auth route group
│   │   │   ├── pin-fallback/        # Fallback after 3 failed fingerprint scans
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx           # Minimal auth layout
│   │   ├── (dashboard)/             # Protected RBAC dashboard routes
│   │   │   ├── admin/               # Admin / Supervisor Routes
│   │   │   │   ├── register/        # Input New Worker Data (Name, PIN, Fingerprint)
│   │   │   │   │   └── page.tsx
│   │   │   │   └── logs/            # System-wide audit trails
│   │   │   │       └── page.tsx
│   │   │   ├── employee/            # Employee Routes
│   │   │   │   ├── maintenance/     # Initiate LOTO sequence
│   │   │   │   │   └── page.tsx
│   │   │   │   └── monitor/         # Real-time machine electrical status
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx           # Dashboard layout (Sidebar + Header)
│   │   ├── api/                     # API Routes
│   │   │   └── webhooks/            # External hardware triggers
│   │   ├── globals.css              # Tailwind CSS + Shadcn variables
│   │   └── layout.tsx               # Root layout
│   │
│   ├── components/                  # ✅ SHARED — Global UI components
│   │   ├── ui/                      # Shadcn UI primitives (button, card, table, etc.)
│   │   ├── layout/                  # Sidebar, Header, MobileNav
│   │   └── theme-provider.tsx
│   │
│   ├── config/                      # App-wide configuration
│   │   ├── env.ts                   # Validated environment variables (Zod)
│   │   └── constants.ts             # Global constants (e.g., MAX_FINGERPRINT_RETRIES = 3)
│   │
│   ├── servers/                     # Database layer (Drizzle + PostgreSQL)
│   │   ├── db/
│   │   │   ├── index.ts             # Drizzle client instance
│   │   │   └── migrations/          # Generated Drizzle migrations
│   │   └── schemas/
│   │       ├── workers.ts           # Workers schema + Zod validators (RBAC)
│   │       ├── machines.ts          # Machines & relay states
│   │       ├── loto-events.ts       # Audit trail for Lock/Unlock events
│   │       └── index.ts             # Barrel export
│   │
│   ├── context/                     # Global React Contexts
│   │   ├── auth-context.tsx         # Auth session (Admin vs Employee state)
│   │   └── mqtt-context.tsx         # Real-time hardware connection state
│   │
│   ├── features/                    # 🏗️ FSD — Isolated feature modules
│   │   ├── loto-status/             # Machine-side feedback & failsafes
│   │   │   ├── components/
│   │   │   │   ├── lock-indicator.tsx
│   │   │   │   ├── failsafe-warning.tsx # TDR / Shunt trip anomaly alerts
│   │   │   │   └── real-time-feed.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-loto-subscription.ts
│   │   │   ├── servers/
│   │   │   │   └── toggle-isolation.ts  # Server action to trigger MQTT lock
│   │   │   └── utils/
│   │   │       └── parse-voltage.ts
│   │   │
│   │   ├── user-mgmt/               # Biometric data & worker permissions
│   │   │   ├── components/
│   │   │   │   ├── registration-form.tsx
│   │   │   │   └── pin-fallback-modal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-fingerprint-scanner.ts
│   │   │   ├── servers/
│   │   │   │   ├── enroll-worker.ts
│   │   │   │   └── verify-pin.ts
│   │   │   └── schemas/
│   │   │       └── worker-registration-schema.ts
│   │   │
│   │   └── logs/                    # Historical audit trail & monitoring
│   │       ├── components/
│   │       │   ├── audit-table.tsx
│   │       │   └── log-filters.tsx
│   │       ├── servers/
│   │       │   └── fetch-audit-trail.ts
│   │       └── utils/
│   │           └── format-log-entry.ts
│   │
│   ├── lib/                         # ✅ SHARED — Library configs & wrappers
│   │   ├── utils.ts                 # cn() utility
│   │   ├── mqtt-client.ts           # MQTT connection handler
│   │   └── drizzle.ts               # Drizzle ORM config
│   │
│   └── types/                       # ✅ SHARED — Global TypeScript definitions
│       ├── loto.ts                  # IsolationState, TdrStatus
│       └── rbac.ts                  # Admin vs Employee enums
│
├── package.json
└── tsconfig.json

```

---

## ⚙️ FIRMWARE Directory Structure

Because E-LOCK utilizes a multi-node architecture with hardware-level failsafes, the firmware is structured to explicitly separate the Gateway, the Field Controller, and the safety logic.

```text
firmware/                            # ESP32 PlatformIO (C++)
├── include/                         # Global headers
│   ├── config.h                     # Pin definitions, WiFi creds, MQTT broker
│   └── types.h                      # Structs for ESP-NOW payloads
│
├── lib/                             # Component libraries
│   ├── Adafruit_Fingerprint/        # AS608 Fingerprint sensor driver
│   ├── ZMPT101B/                    # AC Voltage sensor driver
│   ├── esp-now-handler/             # High-speed node-to-node communication
│   │   ├── esp-now-handler.h
│   │   └── esp-now-handler.cpp
│   └── failsafe-logic/              # TDR and Shunt Trip logic
│       ├── failsafe.h
│       └── failsafe.cpp
│
├── src/                             # Main application source
│   ├── gateway.cpp                  # Node 1: Handles biometrics, RBAC, MQTT
│   ├── field_controller.cpp         # Node 2: Handles relays, voltage sensing
│   └── main.cpp                     # Entry point (conditionally compiles Node 1 or 2)
│
└── platformio.ini                   # Build envs for [env:gateway] & [env:field_controller]

```

---

## 🏗️ Feature Sliced Design (`src/features/`)

Each feature located in `src/features/` is a **self-contained, isolated module**. Features represent a specific domain of the E-LOCK business logic and are **NOT shareable** across other features.

### Isolation Principle

| Location                                                                                | Shareable? | Purpose                    |
| --------------------------------------------------------------------------------------- | ---------- | -------------------------- |
| `src/components/`, `src/hooks/`, `src/lib/`, `src/context/`, `src/utils/`, `src/types/` | ✅ **YES** | Shared globally            |
| `src/features/[name]/`                                                                  | ❌ **NO**  | Feature-specific, isolated |

### Feature Internal Structure

When creating or modifying a feature (e.g., `loto-status`), structure its internal directories as follows:

```text
src/features/[feature-name]/
├── servers/       # Feature-specific server actions (Mutations, Actions, DB calls via Drizzle)
├── components/    # Feature-specific UI components
├── hooks/         # Feature-specific custom hooks
├── schemas/       # Feature-specific Zod schemas (Validation)
└── utils/         # Feature-specific helper functions, mappers

```

### 🛑 Import Rules

You must respect these dependency rules to maintain absolute isolation, preventing circular dependencies in critical safety dashboards:

- **Shared to Feature**: Features CAN import from global shared folders.
- **Within Feature**: Files within a feature CAN import other files from the SAME feature.
- **Feature to Feature**: Features CANNOT import from other features. Cross-feature imports are strictly forbidden.

**Examples:**

```tsx
// ✅ ALLOWED: Shared → Feature (Using global UI button in LOTO feature)
import { Button } from "@/components/ui/button";

// ✅ ALLOWED: Within same feature (LOTO feed importing LOTO lock indicator)
import { LockIndicator } from "@/features/loto-status/components/lock-indicator";

// ❌ FORBIDDEN: Feature → Feature (User Mgmt feature trying to import LOTO status component)
import { LockIndicator } from "@/features/loto-status/components/lock-indicator";
```

> **Need to share between features?**
> If a component or helper (e.g., a biometric status badge) is required by both the `user-mgmt` feature and the `logs` feature, you MUST extract it to `src/components/`, `src/utils/`, or `src/types/` to share it globally rather than creating cross-feature dependencies.
