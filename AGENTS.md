# E-Lock — Agent Instructions

## Repo Structure
- `web/` — Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Shadcn UI, Drizzle ORM
- `firmware/` — ESP32 PlatformIO, C++17, Arduino framework
- Services via Docker: PostgreSQL (`elock-db`), Mosquitto MQTT (`elock-mqtt-broker`)

## Key Commands

### Root (pnpm workspace)
| Command | What |
|---------|------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Build web |
| `pnpm validate` | lint + typecheck + db:check |
| `pnpm docker:up` | Start DB + MQTT broker |
| `pnpm fw:build` | Build both firmware targets |
| `pnpm fw:upload` | Flash gateway to ESP32 on COM3 |

### Web (`cd web`)
| Command | What |
|---------|------|
| `pnpm dev` | `next dev --turbopack` |
| `pnpm dev:lan` | `next dev --turbopack --hostname 0.0.0.0` (LAN access) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm db:studio` | Drizzle Studio (port 4983) |
| `pnpm db:check` | Verify schema in sync |
| `pnpm db:seed` | Seed DB with sample data |
| `pnpm db:migrate` | Apply pending SQL migrations |

### Firmware (`cd firmware`)
| Command | What |
|---------|------|
| `pio run -e esp32-gateway` | Build gateway (fingerprint + lock + MQTT) |
| `pio run -e esp32-field-controller` | Build field controller (LOTO relays + ZMPT) |
| `pio run -t upload` | Flash whichever was last built |
| `pio device monitor` | 115200 baud serial monitor |

## Infrastructure
- **PostgreSQL**: `127.0.0.1:5433` (port is **5433**, not default 5432)
- **MQTT broker**: `localhost:1883` (TCP), `localhost:9001` (WebSocket)
- Docker compose starts both; credentials in `web/.env`
- DB port matches `${DB_PORT:-5433}` in docker-compose

## Drizzle ORM Quirks
- `db:generate` (drizzle-kit generate) is **blocked interactively** — manual SQL migrations instead
- Snapshot files (`migrations/schema.ts`, `migrations/relations.ts`) are auto-generated build artifacts — **gitignored**
- Migration SQL lives in `web/src/drizzle/migrations/` as tracked `.sql` files
- Journal: `web/src/drizzle/migrations/meta/_journal.json`

## MQTT Data Flow (Critical)
- `web/src/lib/mqtt-server.ts` subscribes to `elock/auth` and `elock/status`
- **It only initializes when imported**. Must be imported by every server action file that relies on MQTT events:
  - Biometric login: `auth/actions/auth.ts` → `import "@/lib/mqtt-server"`
  - Enrollment: `personnel/actions/personnel.ts` → already imports `publishMqtt`
- Topics: `elock/auth` (auth_granted/denied), `elock/command` (unlock/lock/enroll/maintenance_on/maintenance_off), `elock/status`, `elock/log`
- ESP32 firmware publishes `{"event":"auth_granted","id":<fingerprintId>}` on auth success
- Server processes auth via in-memory `challenges` Map (globalThis singleton, 120s TTL)
- Challenge flow: `requestBiometricChallengeAction()` → MQTT listener receives `auth_granted` → `verifyChallenge()` → poll sees `verified` → JWT session

## Firmware C++ Quirks
- **`std::make_unique` unavailable** on xtensa toolchain — use `.reset(new Type(...))` instead
- **Ghost-read protection**: Fingerprint sensor `getImage()` can return false positives due to UART noise. Add a confirmation read: `delay(30); getImage();` before proceeding to `image2Tz()`.
- C++17 mode: `-std=gnu++17` in `platformio.ini`
- Build config: `firmware/include/config.h` — WiFi SSID/PSK, MQTT broker IP, GPIO pin mappings — deployment-specific, edit for each environment
- ESP32 only supports **2.4 GHz** WiFi; if SSID ends in `-5G`, find the 2.4 GHz variant
- Firmware lib sources in `lib/<module>/`, headers in `include/` — the `lib/` dirs are treated as components by PlatformIO
- Tests: `test/test_main.cpp` using Unity framework; run with `pio test`
- ESP32 #2 (field-controller.cpp) has no fingerprint sensor, no lock controller, no MQTT — pure ESP-NOW receiver with LOTO relay state machine

## Dual Firmware Environments
- **`esp32-gateway`** (ESP32 #1): `main.cpp` + fingerprint + lock + MQTT + ESP-NOW sender. Flag: `-DDEVICE_GATEWAY`
- **`esp32-field-controller`** (ESP32 #2): `field-controller.cpp` + ESP-NOW receiver + LOTO relays. Flag: `-DDEVICE_FIELD_CONTROLLER`
- Source filtering via `build_src_filter` in `platformio.ini` — each environment excludes the other's entrypoint
- Gateway bridges MQTT `maintenance_on`/`maintenance_off` commands → ESP-NOW `START`/`STOP` messages

## LOTO Field Controller State Machine
```
Standby → (Rx: START) → 10s Delay → Main Relay trips → Monitoring
Monitoring → (voltage > threshold) → Shunt + Timer Relays trip → Tripped
Tripped → (Rx: STOP or Bypass Button) → Standby
```
- Bypass button (`kLotoBypassButtonPin`, active LOW with INPUT_PULLUP) only resets from Tripped
- `kLotoZmptPin` reads analog voltage; threshold `kLotoVoltageThreshold = 3500`
- Pilot light ON in Standby, OFF in Monitoring/Tripped

## Web Architecture
- **Feature-sliced design**: each feature under `web/src/features/<name>/` has `components/`, `server/actions/`, `server/db/`
- **Auth**: Custom JWT (jose) via server actions — no middleware, no next-auth. Access tokens in `elock_access_token` httpOnly cookie, refresh via `elock_refresh_token`
- **No middleware.ts** — route protection is handled client-side via auth context
- **`allowedDevOrigins`** in `next.config.mjs` — update when dev IP changes
- **Env validation**: `@t3-oss/env-nextjs` in `web/src/data/env/server.ts` and `client.ts`
- **DB port 5433** in `.env` — matches `${DB_PORT:-5433}` in docker-compose

## ESP32 CP210x Driver (Windows)
- If Device Manager shows Code 28 on CP2102 USB to UART Bridge, install Silicon Labs CP210x driver:
  ```powershell
  pnputil /add-driver "$env:USERPROFILE\Downloads\CP210x_Universal_Windows_Driver\silabser.inf" /install
  ```
- Verify: `Get-CimInstance Win32_PnPEntity | Where-Object Name -like "*CP210*"`
- Expect: `ConfigManagerErrorCode: 0, Status: OK`
