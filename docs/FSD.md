# Feature-Sliced Design (FSD) — E-Lock Project Reference

> This document serves as the canonical FSD reference for the E-Lock system. Update this as the project evolves.

---

## Architecture Overview

The E-Lock project follows **Feature-Sliced Design** — a frontend architecture methodology that organizes code into isolated, self-contained feature modules alongside globally shared layers.

```text
E-LOCK/
├── web/                         # Next.js Web Dashboard
│   └── src/
│       ├── app/                 # App Router (Pages, Layouts, Route Groups)
│       ├── components/          # ✅ SHARED — Global UI components
│       ├── config/              # ✅ SHARED — App-wide configuration
│       ├── servers/             # ✅ SHARED — Database schemas & Drizzle
│       ├── context/             # ✅ SHARED — Global React Contexts
│       ├── data/                # ✅ SHARED — Static & mock data
│       ├── features/            # 🏗️ FSD — Isolated feature modules
│       ├── hooks/               # ✅ SHARED — Global custom hooks
│       ├── lib/                 # ✅ SHARED — Library configs & wrappers
│       ├── types/               # ✅ SHARED — Global TypeScript definitions
│       └── utils/               # ✅ SHARED — Pure utility functions
├── firmware/                    # ESP32 PlatformIO (C++)
└── docs/                        # Documentation
```

---

## Isolation Principle

| Location | Shareable? | Purpose |
|:---------|:-----------|:--------|
| `src/components/`, `src/hooks/`, `src/lib/`, `src/context/`, `src/utils/`, `src/types/` | ✅ YES | Shared globally |
| `src/features/[name]/` | ❌ NO | Feature-specific, isolated |

---

## Feature Internal Structure

Each feature in `src/features/` is a **self-contained, isolated module**:

```text
src/features/[feature-name]/
├── components/    # Feature-specific UI components
├── hooks/         # Feature-specific custom hooks
├── servers/       # Feature-specific server actions & data mutations
├── schemas/       # Feature-specific Zod validation schemas
└── utils/         # Feature-specific helper functions
```

---

## Current Features

| Feature | Directory | Purpose |
|---------|-----------|---------|
| LOTO Status | `src/features/loto-status/` | Machine-side lock feedback, real-time monitoring, failsafe status |
| User Management | `src/features/user-mgmt/` | Worker/admin registration, biometric enrollment, permissions |
| Audit Logs | `src/features/logs/` | Historical audit trail, log filtering, report export |

---

## Import Rules

### ✅ Allowed

```tsx
// Shared → Feature (feature uses shared component)
import { Button } from "@/components/ui/button";

// Within same feature
import { LotoStatusCard } from "@/features/loto-status/components/loto-status-card";

// Shared types
import { LockState } from "@/types/loto";
```

### ❌ Forbidden

```tsx
// Feature → Feature (cross-feature import)
import { UserTable } from "@/features/user-mgmt/components/user-table";
// ↑ This is NEVER allowed. Extract to src/components/ if shared.
```

---

## Sharing Between Features

> If logic or UI components are required by **multiple features**, you MUST extract them to the shared layer (`src/components/`, `src/hooks/`, `src/lib/`, `src/types/`, or `src/utils/`) instead of creating cross-feature dependencies.

---

## Notes

- This document should be updated whenever new features are added or the architecture evolves.
- Refer to `.agent/.agents/skills/feature-sliced-design/SKILLS.md` for the full agent-facing FSD skill definition.
