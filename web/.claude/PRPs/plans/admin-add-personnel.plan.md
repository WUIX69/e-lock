# Plan: Admin Add New Personnel Modal

## Summary
Build a modal dialog that allows administrators to register new personnel into the E-LOCK system. The modal will be triggered from the Personnel page's "Enroll New Personnel" button and a floating action button. It captures worker name, role, secure PIN, and includes a simulated biometric enrollment section — all backed by a Zod-validated server action that inserts into the `users` PostgreSQL table via Drizzle ORM.

## User Story
As an **admin** user,
I want to **register a new worker** through a modal form with name, role, PIN, and biometric enrollment,
So that **newly onboarded personnel are added to the E-LOCK secure database** and can begin using industrial safety nodes.

## Problem → Solution
**Current state**: The personnel page has an "Enroll New Personnel" button that does nothing. There is no modal, no form, and no server action to create new personnel records.

**Desired state**: Clicking "Enroll New Personnel" (or the FAB) opens a polished, accessible modal dialog matching the HTML prototype's design. The form validates input client-side via Zod, submits to a server action that hashes the PIN and inserts a new user row, then closes the modal and refreshes the personnel list.

## Metadata
- **Complexity**: Medium
- **Source PRD**: N/A (HTML prototype provided)
- **PRD Phase**: N/A
- **Estimated Files**: 10-12

---

## UX Design

### Before
```
┌──────────────────────────────────────────┐
│  Personnel & Clearances    [Export] [Enroll] ← does nothing
│  ┌───────────────────────────────────────┐
│  │  PersonnelStats (4 stat cards)        │
│  ├───────────────────────────────────────┤
│  │  PersonnelTable  │ AccessControlPanel │
│  │  (mock data)     │                    │
│  └───────────────────────────────────────┘
└──────────────────────────────────────────┘
```

### After
```
┌──────────────────────────────────────────┐
│  Personnel & Clearances    [Export] [Enroll] ← opens modal
│  ┌───────────────────────────────────────┐
│  │  PersonnelStats (4 stat cards)        │
│  ├───────────────────────────────────────┤
│  │  PersonnelTable  │ AccessControlPanel │
│  │  (real DB data)  │                    │
│  └───────────────────────────────────────┘
│                                    [FAB+] ← also opens modal
│                                          │
│  ┌─── Modal Overlay ──────────────────┐  │
│  │  ┌── Register New Worker ───────┐  │  │
│  │  │  Full Name  [________]       │  │  │
│  │  │  Employee ID  [auto]  Role ▼ │  │  │
│  │  │  Secure PIN  [••••]  👁      │  │  │
│  │  │  ┌ Biometric Enrollment ──┐  │  │  │
│  │  │  │  🔒 AS608 Scanner      │  │  │  │
│  │  │  │  [Capture Fingerprint] │  │  │  │
│  │  │  └────────────────────────┘  │  │  │
│  │  │  [Cancel]  [Confirm Registration]│  │
│  │  └──────────────────────────────┘  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Interaction Changes
| Touchpoint | Before | After | Notes |
|---|---|---|---|
| "Enroll New Personnel" button | No-op | Opens add personnel dialog | Uses Shadcn Dialog |
| FAB (bottom-right) | Does not exist | Opens add personnel dialog | New component |
| Form submission | N/A | Server action → DB insert → toast → close | Optimistic close on success |
| Personnel table data | Static mock array | Database query (with mock fallback initially) | Server action fetches from DB |

---

## Mandatory Reading

Files that MUST be read before implementing:

| Priority | File | Lines | Why |
|---|---|---|---|
| P0 (critical) | `src/features/auth/server/actions/index.ts` | all | Server action pattern to mirror |
| P0 (critical) | `src/features/auth/server/db/index.ts` | all | DB query function pattern |
| P0 (critical) | `src/drizzle/schema.ts` | all | UserTable schema & enums |
| P0 (critical) | `src/features/auth/components/login-form.tsx` | 25-44, 87-167 | Form submission + state management pattern |
| P1 (important) | `src/components/ui/dialog.tsx` | all | Dialog component API |
| P1 (important) | `src/components/ui/input.tsx` | all | Input component API |
| P1 (important) | `src/components/ui/select.tsx` | all | Select component API |
| P1 (important) | `src/components/ui/label.tsx` | all | Label component API |
| P1 (important) | `src/types/personnel.ts` | all | Existing personnel types |
| P2 (reference) | `src/app/(dashboard)/admin/personnel/page.tsx` | all | Page where dialog is triggered |
| P2 (reference) | `src/features/personnel/components/personnel-table.tsx` | all | Existing table to integrate with |
| P2 (reference) | `src/data/env/server.ts` | all | Env validation pattern |

---

## Patterns to Mirror

Code patterns discovered in the codebase. Follow these exactly.

### NAMING_CONVENTION
```ts
// SOURCE: src/features/auth/server/actions/index.ts:30
// Server actions use camelCase with "Action" suffix
export async function loginAction(formData: FormData) { ... }

// SOURCE: src/features/auth/server/db/index.ts:5
// DB query functions use camelCase with descriptive names
export async function getUserByEmail(email: string) { ... }

// SOURCE: src/features/personnel/components/personnel-table.tsx:14
// Components use PascalCase arrow function exports
export const PersonnelTable = () => { ... }
```

### ERROR_HANDLING
```ts
// SOURCE: src/features/auth/server/actions/index.ts:34-46,80-83
// Server actions return { error: string } on failure, { success: true, ... } on success
if (!email || !password) {
  return { error: "Email and password are required" }
}
// ...
} catch (error) {
  console.error("Login error:", error)
  return { error: "An unexpected error occurred" }
}
```

### FORM_SUBMISSION
```ts
// SOURCE: src/features/auth/components/login-form.tsx:25-44
// Client forms use React.FormEvent<HTMLFormElement> with FormData + server action
const [isLoading, setIsLoading] = React.useState<boolean>(false)
const [error, setError] = React.useState<string | null>(null)

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsLoading(true)
  setError(null)
  const formData = new FormData(e.currentTarget)
  const result = await loginAction(formData)
  if (result.error) {
    setError(result.error)
    setIsLoading(false)
  } else {
    router.push("/")
  }
}
```

### LABEL_STYLE
```tsx
// SOURCE: src/features/auth/components/login-form.tsx:90-95
// Labels use uppercase, tiny tracking-widest style
<label
  htmlFor="email"
  className="text-[10px] font-black tracking-widest text-muted-foreground uppercase"
>
  Email Address
</label>
```

### INPUT_STYLE
```tsx
// SOURCE: src/features/auth/components/login-form.tsx:96-106
// Input containers use group + icon + tall rounded inputs
<div className="group relative">
  <CreditCard className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
  <Input
    id="email"
    name="email"
    type="email"
    placeholder="admin@elock.dev"
    className="h-14 rounded-2xl border-border bg-muted pl-12 font-mono text-sm focus-visible:ring-primary"
    required
  />
</div>
```

### DB_QUERY_PATTERN
```ts
// SOURCE: src/features/auth/server/db/index.ts:5-8
// Drizzle queries use select/from/where with eq helper
import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export async function getUserByEmail(email: string) {
  const users = await db.select().from(UserTable).where(eq(UserTable.email, email)).limit(1)
  return users[0] || null
}
```

### BUTTON_STYLE
```tsx
// SOURCE: src/app/(dashboard)/admin/personnel/page.tsx:35-38
// Primary CTA buttons use sidebar bg with uppercase tracking
<button className="flex items-center gap-2 rounded-2xl bg-sidebar px-6 py-3 text-sm font-black tracking-widest text-sidebar-foreground uppercase shadow-lg transition-transform hover:scale-105 active:scale-95">
  <UserPlus className="size-4 text-sidebar-accent" />
  Enroll New Personnel
</button>
```

---

## Files to Change

| File | Action | Justification |
|---|---|---|
| `src/features/personnel/schemas/add-personnel-schema.ts` | CREATE | Zod validation schema for the form |
| `src/features/personnel/server/db/index.ts` | CREATE | DB query: insert user, check email uniqueness |
| `src/features/personnel/server/actions/index.ts` | CREATE | Server action: addPersonnelAction |
| `src/features/personnel/components/add-personnel-dialog.tsx` | CREATE | Modal dialog UI (main deliverable) |
| `src/features/personnel/components/add-personnel-form.tsx` | CREATE | Form component inside the dialog |
| `src/features/personnel/components/biometric-enrollment-section.tsx` | CREATE | Simulated biometric enrollment UI block |
| `src/features/personnel/components/add-personnel-fab.tsx` | CREATE | Floating Action Button trigger |
| `src/types/personnel.ts` | UPDATE | Add AddPersonnelFormData interface |
| `src/app/(dashboard)/admin/personnel/page.tsx` | UPDATE | Wire dialog trigger to "Enroll" button + add FAB |
| `src/features/personnel/components/personnel-table.tsx` | UPDATE | Replace MOCK_PERSONNEL with server data OR useRouter refresh |

## NOT Building

- Real AS608 fingerprint scanner hardware integration (simulated UI only)
- Real-time biometric capture over WebSocket/MQTT
- Personnel edit or delete flows
- Email verification or invitation system
- Profile photo upload
- Personnel search/filter functionality (existing placeholder stays)
- Drizzle migration (use `db:push` for schema updates)

---

## Step-by-Step Tasks

### Task 1: Create Zod Validation Schema
- **ACTION**: Create `src/features/personnel/schemas/add-personnel-schema.ts`
- **IMPLEMENT**: Zod schema with `fullName` (min 2), `role` (enum: "admin" | "user"), `pin` (exactly 4 digits), `email` (valid email)
- **MIRROR**: Follow auth feature schema directory pattern (`features/auth/schemas/`)
- **IMPORTS**: `import { z } from "zod"`
- **GOTCHA**: The codebase uses Zod v4 — use `z.string()` standard API. Role enum must match `UserRoleEnum` values: `["admin", "user"]`
- **VALIDATE**: Schema exports without type errors, covers all form fields

### Task 2: Create Personnel DB Functions
- **ACTION**: Create `src/features/personnel/server/db/index.ts`
- **IMPLEMENT**: `insertPersonnel()` — receives validated data, hashes PIN as password, inserts into UserTable. Also `getPersonnelById()` and `getAllPersonnel()` for future use.
- **MIRROR**: `DB_QUERY_PATTERN` from `src/features/auth/server/db/index.ts`
- **IMPORTS**: `import { db } from "@/drizzle/db"`, `import { UserTable } from "@/drizzle/schema"`, `import * as bcrypt from "bcryptjs"`
- **GOTCHA**: Use `.onConflictDoNothing({ target: UserTable.email })` or check email uniqueness first. PIN is stored in `passwordHash` column since schema has no separate PIN field — this is intentional per current schema design.
- **VALIDATE**: Functions compile, proper return types

### Task 3: Create Server Action
- **ACTION**: Create `src/features/personnel/server/actions/index.ts`
- **IMPLEMENT**: `addPersonnelAction(formData: FormData)` — parse with Zod schema, call DB function, return `{ success: true }` or `{ error: string }`
- **MIRROR**: `ERROR_HANDLING` pattern from auth server actions
- **IMPORTS**: Zod schema from `../schemas`, DB function from `../db`
- **GOTCHA**: Must add `"use server"` directive at top. Must handle duplicate email error gracefully.
- **VALIDATE**: Action callable from client component, returns typed result

### Task 4: Create Biometric Enrollment Section
- **ACTION**: Create `src/features/personnel/components/biometric-enrollment-section.tsx`
- **IMPLEMENT**: Simulated biometric enrollment UI matching the HTML prototype — shows fingerprint icon with pulse animation, progress bar (step 1 of 3), and "Capture Fingerprint" button. This is a visual placeholder for future hardware integration.
- **MIRROR**: Use existing Tailwind theme tokens: `bg-accent`, `text-primary`, etc. Match the green accent palette from the prototype.
- **IMPORTS**: `lucide-react` (Fingerprint, Radio icons), Button from `@/components/ui/button`
- **GOTCHA**: This is display-only in Phase 1 — no real biometric logic. Use `bg-primary/10` for the green background area to match existing theme.
- **VALIDATE**: Component renders correctly inside dialog, animation works

### Task 5: Create Add Personnel Form
- **ACTION**: Create `src/features/personnel/components/add-personnel-form.tsx`
- **IMPLEMENT**: Form matching the HTML prototype layout:
  - Full Name input (icon: `User`)
  - 2-column grid: Employee ID (auto-generated, disabled) + Assigned Role (Select dropdown)
  - Secure PIN input with visibility toggle (icon: `Lock`)
  - Email input (for system login)
  - `<BiometricEnrollmentSection />` embedded
  - Error display area
  - Footer: Cancel + Confirm Registration buttons
- **MIRROR**: `FORM_SUBMISSION`, `LABEL_STYLE`, `INPUT_STYLE` patterns
- **IMPORTS**: Shadcn Dialog components, Input, Label, Select, Button, server action
- **GOTCHA**: Use `name` attributes on all inputs for FormData extraction. Employee ID auto-generation format: `EL-YYYY-XXXX` (year + random 4 digits). PIN toggle must use local state for `type="password" | "text"`.
- **VALIDATE**: Form renders matching prototype, submits to server action, shows errors

### Task 6: Create Add Personnel Dialog
- **ACTION**: Create `src/features/personnel/components/add-personnel-dialog.tsx`
- **IMPLEMENT**: Wrapper component using Shadcn `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`. Contains `AddPersonnelForm`. Exposes an `isOpen` / `onOpenChange` controlled interface. Sizes dialog to `sm:max-w-lg`.
- **MIRROR**: Shadcn Dialog pattern from `src/components/ui/dialog.tsx`
- **IMPORTS**: Dialog components from `@/components/ui/dialog`, AddPersonnelForm
- **GOTCHA**: The dialog's `showCloseButton` prop defaults to `true` — use it. DialogContent has `sm:max-w-sm` default, override to `sm:max-w-lg`.
- **VALIDATE**: Dialog opens/closes cleanly, form submits and dialog closes on success

### Task 7: Create Floating Action Button
- **ACTION**: Create `src/features/personnel/components/add-personnel-fab.tsx`
- **IMPLEMENT**: Fixed-position button (bottom-right) matching the HTML prototype — `w-14 h-14` rounded-full with `+` icon, rotates on hover. Opens the same dialog.
- **MIRROR**: `BUTTON_STYLE` from personnel page
- **IMPORTS**: `lucide-react` (Plus), Dialog components
- **GOTCHA**: Must use `fixed bottom-8 right-8 z-50` positioning. Must coordinate dialog state with the page-level dialog (share open state via props or lifted state).
- **VALIDATE**: FAB renders bottom-right, click opens dialog

### Task 8: Update Personnel Types
- **ACTION**: Update `src/types/personnel.ts`
- **IMPLEMENT**: Add `AddPersonnelFormData` interface and `AddPersonnelResult` interface for server action response typing
- **MIRROR**: Existing interface patterns in the file
- **IMPORTS**: N/A
- **GOTCHA**: Keep existing interfaces intact, only add new ones
- **VALIDATE**: No type errors, interfaces exported

### Task 9: Wire Up Personnel Page
- **ACTION**: Update `src/app/(dashboard)/admin/personnel/page.tsx`
- **IMPLEMENT**: 
  - Import `AddPersonnelDialog` and `AddPersonnelFab`
  - Convert page to client component wrapper OR create a client wrapper component for the dialog state
  - Wire "Enroll New Personnel" button to open dialog
  - Add FAB component
- **MIRROR**: Page structure pattern from existing `page.tsx`
- **IMPORTS**: New dialog + FAB components
- **GOTCHA**: The page currently has `export const metadata` which requires a Server Component. Either (a) keep page as SC and create a client wrapper, or (b) move metadata to a `generateMetadata` approach. Best approach: create a `PersonnelPageClient` wrapper that handles dialog state, keep page as SC.
- **VALIDATE**: Page renders, button opens dialog, FAB opens dialog

### Task 10: Update Personnel Table for Data Refresh
- **ACTION**: Update `src/features/personnel/components/personnel-table.tsx`
- **IMPLEMENT**: After a successful personnel add, the table should refresh. Use `useRouter().refresh()` in the form success handler to trigger a server-side re-render. For now, keep mock data but add a TODO comment for future DB integration since this is a separate concern.
- **MIRROR**: Router refresh pattern from login-form (`router.push("/")`)
- **IMPORTS**: N/A for this task (minimal change)
- **GOTCHA**: Do NOT replace mock data with real DB queries in this feature scope — that's a separate task. Just ensure the table component can be refreshed.
- **VALIDATE**: After form submission, router.refresh() is called

---

## Testing Strategy

### Manual Browser Testing

| Test | Input | Expected Output | Edge Case? |
|---|---|---|---|
| Open dialog via button | Click "Enroll New Personnel" | Dialog opens with empty form | No |
| Open dialog via FAB | Click floating + button | Same dialog opens | No |
| Close dialog (X button) | Click X in header | Dialog closes, form resets | No |
| Close dialog (Cancel) | Click Cancel button | Dialog closes, form resets | No |
| Close dialog (overlay) | Click backdrop | Dialog closes | No |
| Submit empty form | Click "Confirm" without filling | Client-side validation errors shown | Yes |
| Submit valid data | Fill name, email, select role, enter 4-digit PIN | Success → dialog closes | No |
| Submit duplicate email | Use existing `admin@elock.dev` | Error: "Email already registered" | Yes |
| PIN validation | Enter "abc", "123", "12345" | Error: "PIN must be exactly 4 digits" | Yes |
| Name validation | Enter "A" | Error: "Name must be at least 2 characters" | Yes |
| PIN visibility toggle | Click eye icon | Toggles between `••••` and plain text | No |
| Employee ID auto-gen | Open form | Shows `EL-2026-XXXX` disabled field | No |
| Biometric section | View form | Shows animated fingerprint scanner UI | No |

### Edge Cases Checklist
- [ ] Empty input (all fields)
- [ ] PIN with non-numeric characters
- [ ] PIN less than or more than 4 digits
- [ ] Duplicate email address
- [ ] Extremely long name input
- [ ] Special characters in name
- [ ] Rapid double-submit (loading state prevents)
- [ ] Dialog keyboard navigation (Escape to close)
- [ ] Screen reader accessibility

---

## Validation Commands

### Static Analysis
```bash
pnpm typecheck
```
EXPECT: Zero type errors

### Lint
```bash
pnpm lint
```
EXPECT: No lint errors in new files

### Full Validation
```bash
pnpm run validate
```
EXPECT: lint + typecheck + db:check all pass

### Browser Validation
```bash
pnpm run dev
```
EXPECT:
1. Navigate to `/admin/personnel`
2. Click "Enroll New Personnel" → dialog opens
3. Fill form → submit → success
4. Check Drizzle Studio: `pnpm db:studio` → new user row visible

### Manual Validation
- [ ] Dialog opens from "Enroll New Personnel" button
- [ ] Dialog opens from FAB (floating action button)
- [ ] Form validates all fields before submission
- [ ] Error messages display clearly
- [ ] Success closes dialog
- [ ] PIN visibility toggle works
- [ ] Employee ID is auto-generated
- [ ] Biometric enrollment section displays correctly with animation
- [ ] Dialog is accessible (keyboard navigable, screen reader friendly)
- [ ] Dialog matches the HTML prototype design language

---

## Acceptance Criteria
- [ ] All tasks (1-10) completed
- [ ] All validation commands pass (typecheck, lint, validate)
- [ ] Modal form fully functional (open, fill, submit, close)
- [ ] Server action inserts into PostgreSQL via Drizzle
- [ ] PIN is hashed before storage
- [ ] Duplicate email returns user-friendly error
- [ ] Dialog matches HTML prototype design (colors, layout, typography)
- [ ] No modifications to `globals.css`
- [ ] FSD architecture respected (feature-scoped files)
- [ ] All interactive elements have accessibility attributes

## Completion Checklist
- [ ] Code follows discovered patterns (server actions, DB queries, form handling)
- [ ] Error handling matches codebase style (`{ error: string }` returns)
- [ ] No hardcoded values (colors from theme, text configurable)
- [ ] Components use arrow function exports
- [ ] Interfaces used over types (per user rules)
- [ ] Descriptive variable names (per user rules)
- [ ] Event handlers prefixed with `handle` (per user rules)
- [ ] `cn()` used for conditional styling
- [ ] No unnecessary scope additions
- [ ] Self-contained — no questions needed during implementation

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Schema mismatch: UserTable has no PIN field, PIN goes to passwordHash | Low | Medium | Document intentional design: PIN = password for hardware personnel. Workers authenticate via PIN on ESP32, not email/password. |
| Dialog z-index conflict with sidebar | Low | Low | Shadcn Dialog uses `z-50`, sidebar is `z-40` — no conflict |
| Server action file detection: Next.js 16 requires explicit `"use server"` | Medium | High | Always add directive. Test server action compilation early. |
| Employee ID collision | Low | Low | Use `EL-YYYY-XXXX` with random suffix + UUID primary key in DB |

## Notes
- The biometric enrollment section is **purely visual** in this phase. Real AS608 fingerprint integration will come via the ESP32 firmware + MQTT pipeline in a future feature.
- The `passwordHash` column is reused for PIN storage — this is intentional. Factory floor workers authenticate via 4-digit PIN on the ESP32 hardware, while admin users authenticate via email/password on the web portal. Both use bcrypt hashing.
- The form follows the HTML prototype's Material Design-inspired layout but adapts it to use the project's existing Shadcn UI components and oklch color system from `globals.css`.
- The Employee ID (`EL-YYYY-XXXX`) is auto-generated client-side for display only. The actual primary key in the database is a UUID.
