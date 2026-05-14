# Feature Sliced Design (FSD) Architecture Guidelines

When developing features and adding new code to this project, you MUST strictly adhere to the Feature Sliced Design architecture and folder structure outlined below.

## 📂 Directory Structure Overview

The project is structured into global shared elements and isolated features:

```text
E-LOCK/
├── web/ # Next.js Web Dashboard
│ ├── src/
│ │ ├── app/ # App Router (Pages, Layouts, API Routes)
│ │ │ ├── auth/ # Secure worker/admin authentication
│ │ │ ├── admin/ # Personnel registration & system manual control
│ │ │ ├── dashboard/ # Real-time LOTO monitoring & feedback
│ │ │ └── layout.tsx # Root layout with Sidebar/Header
│ │ ├── components/ # Shared UI (e.g., Shadcn primitives, layout, etc)
│ │ ├── config/ # App-wide configuration (e.g., Env, constants, base URLs, Drizzle/Postgres connection, etc)
│ │ ├── servers/ # PostgreSQL Schema & Drizzle Migrations
│ │ │ ├── schemas/ # Drizzle Schemas, Zod, Validators, etc.
│ │ │ └── db/ # Drizzle Migrations, etc.
│ │ ├── context/ # Global React Contexts (e.g., Auth, Theme, Mobile menu)
│ │ ├── data/ # Static data, constants, and mock data
│ │ ├── features/ # Domain-specific business logic, Feature-based business logic
│ │ │ ├── loto-status/ # Logic for machine-side feedback & failsafes
│ │ │ ├── user-mgmt/ # Biometric data association & worker permissions
│ │ │ └── logs/ # Historical audit trail & audit generation
│ │ ├── hooks/ # Global custom hooks
│ │ ├── lib/ # utility wrappers, library configurations, etc.
│ │ └── types/ # Global, Shared TypeScript definitions
│ │ └── utils/ # Shared utility functions
├── firmware/ # Hardware Implementation (C++)
│ ├── src/ # ESP32 Source Code
│ ├── lib/ # Hardware libraries (Adafruit_Fingerprint, etc.)
│ └── platformio.ini # PlatformIO build configuration
└── docs/ # Design & CAD Documentation
```

# WEB Dir

```text
web/
├── public/                          # Static assets (logos, icons, OG images)
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Auth route group (login, register)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx           # Minimal auth layout (no sidebar)
│   │   ├── (dashboard)/             # Protected dashboard route group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # Real-time LOTO monitoring & feedback
│   │   │   ├── admin/
│   │   │   │   ├── personnel/
│   │   │   │   │   └── page.tsx     # Personnel registration & biometric enrollment
│   │   │   │   ├── machines/
│   │   │   │   │   └── page.tsx     # Machine/lock registration & manual control
│   │   │   │   └── page.tsx         # Admin overview
│   │   │   ├── logs/
│   │   │   │   └── page.tsx         # Historical audit trail viewer
│   │   │   └── layout.tsx           # Dashboard layout (sidebar + header)
│   │   ├── api/                     # API Routes (if needed beyond server actions)
│   │   │   └── mqtt/
│   │   │       └── route.ts         # MQTT WebSocket relay (optional)
│   │   ├── globals.css              # Tailwind v4 + Shadcn CSS variables
│   │   ├── layout.tsx               # Root layout (fonts, ThemeProvider)
│   │   ├── not-found.tsx            # Custom 404
│   │   └── page.tsx                 # Landing / redirect to dashboard
│   │
│   ├── components/                  # ✅ SHARED — Global UI components
│   │   ├── ui/                      # Shadcn UI primitives (button, card, table, etc.)
│   │   ├── layout/                  # Sidebar, Header, Footer, MobileNav
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   └── footer.tsx
│   │   ├── theme-provider.tsx       # next-themes provider (EXISTS)
│   │   └── icons.tsx                # Centralized icon exports
│   │
│   ├── config/                      # App-wide configuration
│   │   ├── site.ts                  # Site metadata, navigation links
│   │   ├── env.ts                   # Validated environment variables (Zod)
│   │   └── constants.ts             # Global constants (roles, statuses, etc.)
│   │
│   ├── servers/                     # Database layer (Drizzle + PostgreSQL)
│   │   ├── db/
│   │   │   ├── index.ts             # Drizzle client instance
│   │   │   ├── migrate.ts           # Migration runner
│   │   │   └── migrations/          # Generated Drizzle migrations
│   │   └── schemas/
│   │       ├── users.ts             # Users/workers schema + Zod validators
│   │       ├── machines.ts          # Machines/locks schema
│   │       ├── loto-events.ts       # LOTO lock/unlock event audit log
│   │       ├── fingerprints.ts      # Biometric data association
│   │       └── index.ts             # Barrel export
│   │
│   ├── context/                     # Global React Contexts
│   │   ├── auth-context.tsx         # Auth session context
│   │   ├── mqtt-context.tsx         # MQTT connection state context
│   │   └── sidebar-context.tsx      # Sidebar/mobile nav toggle
│   │
│   ├── data/                        # Static data, mock data, seed data
│   │   ├── navigation.ts            # Sidebar nav items
│   │   └── mock/                    # Development mock data
│   │       ├── mock-users.ts
│   │       ├── mock-machines.ts
│   │       └── mock-events.ts
│   │
│   ├── features/                    # 🏗️ FSD — Isolated feature modules
│   │   ├── loto-status/             # Machine-side feedback & failsafes
│   │   │   ├── components/
│   │   │   │   ├── loto-status-card.tsx
│   │   │   │   ├── lock-indicator.tsx
│   │   │   │   └── real-time-feed.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-loto-subscription.ts
│   │   │   ├── servers/
│   │   │   │   ├── get-loto-status.ts
│   │   │   │   └── toggle-lock.ts
│   │   │   ├── schemas/
│   │   │   │   └── loto-event-schema.ts
│   │   │   └── utils/
│   │   │       └── format-lock-state.ts
│   │   │
│   │   ├── user-mgmt/               # Biometric data & worker permissions
│   │   │   ├── components/
│   │   │   │   ├── user-table.tsx
│   │   │   │   ├── user-form.tsx
│   │   │   │   └── fingerprint-enrollment.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-fingerprint-status.ts
│   │   │   ├── servers/
│   │   │   │   ├── create-user.ts
│   │   │   │   ├── update-user.ts
│   │   │   │   └── get-users.ts
│   │   │   ├── schemas/
│   │   │   │   └── user-form-schema.ts
│   │   │   └── utils/
│   │   │       └── role-permissions.ts
│   │   │
│   │   └── logs/                    # Historical audit trail & report generation
│   │       ├── components/
│   │       │   ├── log-table.tsx
│   │       │   ├── log-filters.tsx
│   │       │   └── log-export-button.tsx
│   │       ├── hooks/
│   │       │   └── use-log-filters.ts
│   │       ├── servers/
│   │       │   ├── get-logs.ts
│   │       │   └── export-logs.ts
│   │       ├── schemas/
│   │       │   └── log-filter-schema.ts
│   │       └── utils/
│   │           └── format-log-entry.ts
│   │
│   ├── hooks/                       # ✅ SHARED — Global custom hooks
│   │   ├── use-media-query.ts
│   │   └── use-debounce.ts
│   │
│   ├── lib/                         # ✅ SHARED — Library configs & wrappers
│   │   ├── utils.ts                 # cn() utility (EXISTS)
│   │   ├── mqtt-client.ts           # MQTT.js client wrapper
│   │   └── drizzle.ts               # Drizzle ORM config export
│   │
│   ├── types/                       # ✅ SHARED — Global TypeScript definitions
│   │   ├── loto.ts                  # LOTO domain types (LockState, LotoEvent, etc.)
│   │   ├── user.ts                  # User/Worker domain types
│   │   ├── machine.ts               # Machine/Lock domain types
│   │   └── mqtt.ts                  # MQTT message payload types
│   │
│   └── utils/                       # ✅ SHARED — Pure utility functions
│       ├── format-date.ts           # Date formatting helper
│       └── generate-id.ts           # ID generation helper
│
├── .next/                           # Next.js build output (gitignored)
├── node_modules/                    # Dependencies (gitignored)
├── components.json                  # Shadcn configuration
├── eslint.config.mjs                # ESLint configuration
├── next.config.mjs                  # Next.js configuration
├── package.json                     # Web workspace package.json
├── pnpm-lock.yaml                   # Lockfile
├── postcss.config.mjs               # PostCSS (Tailwind)
└── tsconfig.json                    # TypeScript configuration

```

# FIRMWARE Dir

```text
firmware/
├── include/                         # Global headers
│   ├── config.h                     # Pin definitions, WiFi creds, MQTT broker
│   ├── constants.h                  # System-wide constants (timeouts, retries)
│   └── types.h                      # Shared struct/enum definitions
│
├── lib/                             # Component libraries (PlatformIO lib convention)
│   ├── fingerprint/                 # Fingerprint sensor driver
│   │   ├── fingerprint-sensor.h
│   │   └── fingerprint-sensor.cpp
│   ├── lock-controller/             # Solenoid/relay lock control
│   │   ├── lock-controller.h
│   │   └── lock-controller.cpp
│   ├── mqtt-handler/                # MQTT publish/subscribe logic
│   │   ├── mqtt-handler.h
│   │   └── mqtt-handler.cpp
│   ├── wifi-manager/                # WiFi connection management
│   │   ├── wifi-manager.h
│   │   └── wifi-manager.cpp
│   ├── esp-now-handler/             # ESP-NOW peer communication (optional)
│   │   ├── esp-now-handler.h
│   │   └── esp-now-handler.cpp
│   ├── display-manager/             # OLED/LCD display feedback (optional)
│   │   ├── display-manager.h
│   │   └── display-manager.cpp
│   └── buzzer-led/                  # Audio/visual feedback (buzzer + LED)
│       ├── buzzer-led.h
│       └── buzzer-led.cpp
│
├── src/                             # Main application source
│   └── main.cpp                     # Entry point — setup() + loop()
│
├── test/                            # PlatformIO unit tests
│   └── test_main.cpp
│
├── platformio.ini                   # PlatformIO build configuration
└── .clang-format                    # C++ formatter config

```

---

## 🏗️ Feature Sliced Design (`src/features/`)

Each feature located in `src/features/` is a **self-contained, isolated module**. Features are **NOT shareable** across other features.

### Isolation Principle

| Location                                                                                 | Shareable? | Purpose                    |
| :--------------------------------------------------------------------------------------- | :--------- | :------------------------- |
| `src/components/`, `src/hooks/`, `src/lib/`, `src/contexts/`, `src/utils/`, `src/types/` | ✅ **YES** | Shared globally            |
| `src/features/[name]/`                                                                   | ❌ **NO**  | Feature-specific, isolated |

### Feature Internal Structure

When creating or modifying a feature, structure its internal directories as follows:

```text
src/features/[feature-name]/
├── servers/       # Feature-specific server actions (e.g. Actions, API calls, Database Operations and mutations)
├── components/    # Feature-specific UI components
├── hooks/         # Feature-specific custom hooks
├── schemas/       # Feature-specific Zod schemas
└── utils/         # Feature-specific helper functions, mappers, validators
```

### 🛑 Import Rules

You must respect these dependency rules to maintain isolation:

- **Shared to Feature**: Features CAN import from global shared folders.
- **Within Feature**: Files within a feature CAN import other files from the SAME feature.
- **Feature to Feature**: Features CANNOT import from other features. Cross-feature imports are strictly forbidden.

**Examples:**

```tsx
// ✅ ALLOWED: Shared → Feature
import { Button } from "@/components/ui/button";

// ✅ ALLOWED: Within same feature (e.g. projects feature)
import { ProjectCard } from "@/features/projects/components/project-card";

// ❌ FORBIDDEN: Feature → Feature (e.g. projects feature → services feature)
import { ServiceCard } from "@/features/services/components/service-card";
```

> **Need to share between features?**
> If logic or UI components are required by multiple features, you MUST extract them to `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`, or `src/utils/` to share them globally instead of creating cross-feature dependencies.
