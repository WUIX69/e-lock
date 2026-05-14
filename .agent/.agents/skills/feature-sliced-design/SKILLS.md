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
