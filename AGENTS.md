# E-Lock — Agent Instructions

## Repo
- pnpm workspace monorepo: `web/` (Next.js 16, React 19, Shadcn UI, Drizzle ORM), `firmware/` (ESP32 PlatformIO C++17)
- Services (Docker): PostgreSQL `elock-db` (port **5433**), Mosquitto MQTT `elock-mqtt-broker` (1883 TCP, 9001 WS)
- Root `.env` has infra creds; `web/.env` has `DATABASE_URL`, JWT secrets, MQTT creds

## Commands
| Scope | Command | What |
|-------|---------|------|
| root | `pnpm dev` | Start Next.js dev server |
| root | `pnpm build` | Build web |
| root | `pnpm validate` | lint → typecheck → db:check |
| root | `pnpm docker:up` | Start DB + MQTT |
| root | `pnpm fw:build` | Build both firmware targets |
| root | `pnpm fw:build:gateway` | Build gateway only |
| root | `pnpm fw:build:field` | Build field controller only |
| root | `pnpm fw:upload:gateway` | Upload firmware to gateway |
| root | `pnpm fw:upload:field` | Upload firmware to field controller |
| web | `pnpm dev:lan` | Dev server on 0.0.0.0 (LAN) |
| web | `pnpm typecheck` | `tsc --noEmit` |
| web | `pnpm db:migrate` | Apply SQL migrations |
| web | `pnpm db:seed` | Seed sample data |
| web | `pnpm db:studio` | Drizzle Studio port 4983 |
| firmware | `pio run -e esp32-gateway` | Build gateway |
| firmware | `pio run -e esp32-field-controller` | Build field controller |

## Web Architecture
- **Feature-sliced**: `web/src/features/<name>/` has `components/`, `server/actions/`, `server/db/`
- **Auth**: Custom JWT (jose) via server actions — no middleware, no next-auth. Tokens in `elock_access_token` / `elock_refresh_token` httpOnly cookies. Route protection: server-side `requireAuth()` in `(dashboard)/layout.tsx`, client-side via `AuthProvider` context
- **Dashboard layout** (`(dashboard)/layout.tsx`): calls `requireAuth()` server-side, wraps in `<AuthProvider>` + `<SidebarProvider>`. Admin vs user routing handled per-page via `currentUser.role`
- **Server actions**: 10 MB body size limit (`next.config.mjs:serverActions.bodySizeLimit`)
- **`allowedDevOrigins`** in `next.config.mjs` — update when dev IP changes
- **Env validation**: `@t3-oss/env-nextjs` in `web/src/data/env/server.ts` and `client.ts`
- **Client pages** using `useEffect` + `refreshKey` for data fetching need explicit `onRefresh` callbacks wired to `ToolbarRow` — `router.refresh()` fallback only works for server component pages

## Drizzle ORM
- Manual SQL migrations: `.sql` files live in `web/src/drizzle/migrations/`, tracked in git, named with numeric prefix (e.g., `0012_add_relay_fault.sql`)
- Journal: `web/src/drizzle/migrations/meta/_journal.json`
- Schema snapshots (`migrations/schema.ts`, `migrations/relations.ts`) are auto-generated build artifacts — **gitignored**
- `db:push`, `db:generate`, `db:migrate`, `db:check` all available; team convention prefers manual SQL for named migrations

## MQTT Flow
- `web/src/lib/mqtt-server.ts` subscribes to `elock/auth`, `elock/status` — **only initializes when imported**, must be imported by every server action that relies on MQTT events
- Topics: `elock/auth` (auth_granted/denied), `elock/command` (unlock/lock/enroll/maintenance_on/off), `elock/status`, `elock/log`
- Auth uses in-memory `challenges` Map (globalThis singleton, 120s TTL): `requestBiometricChallengeAction()` → MQTT listener receives `auth_granted` → `verifyChallenge()` → poll sees `verified` → JWT session

## Key DB Tables
- `UserTable`: employeeId, email, passwordHash, role (admin|user), fingerprintId, securityLevel
- `DeviceTable`: deviceId, type, deviceUniqueName, macAddress, isHighPriority, signalStrength, status
- `TaskTable`: deviceId, userId, taskType, priority, subject, status, coWorker links + invitation status

## Firmware
- **Two ESP32 builds**: `esp32-gateway` (main.cpp — fingerprint + lock + MQTT + ESP-NOW sender) and `esp32-field-controller` (field-controller.cpp — ESP-NOW receiver + LOTO relay state machine). Source filtering in `platformio.ini` excludes the other entrypoint per env
- `std::make_unique` unavailable on xtensa — use `.reset(new Type(...))`
- **Ghost-read protection**: `getImage()` can false-positive from UART noise — add `delay(30); getImage();` before `image2Tz()`
- ESP32 only supports 2.4 GHz WiFi
- Tests: `test/test_main.cpp` using Unity framework; run with `pio test`
- Deployment config: `firmware/include/config.h` (WiFi, MQTT broker IP, GPIO pins)
