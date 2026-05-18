# Environment Variables Guide

This document describes all environment variables used in the E-LOCK monorepo. It details variables required for Docker-based infrastructure and those required by the Next.js web application.

<!-- AUTO-GENERATED:START -->

## 1. Infrastructure Settings (Docker Compose)

These variables are defined in the root-level `.env` file (copied from `.env.example`). They configure the database and MQTT broker containers, as well as port mappings on the host.

| Variable Name | Required | Default / Example Value | Description |
|---|---|---|---|
| `POSTGRES_USER` | Yes | `e_lock` | The superuser username for the PostgreSQL database container. |
| `POSTGRES_PASSWORD` | Yes | `e_lock_ZxcBRK01!` | The superuser password for the PostgreSQL database container. |
| `POSTGRES_DB` | Yes | `elock_db` | The default database created inside the PostgreSQL container. |
| `MQTT_USERNAME` | Yes | `elock_mqtt` | The username required for devices and services to authenticate with Mosquitto. |
| `MQTT_PASSWORD` | Yes | `elock_mqtt_2026` | The password required for devices and services to authenticate with Mosquitto. |
| `DB_PORT` | No | `5433` | The host port mapped to the PostgreSQL container port (`5432`). |
| `MQTT_PORT` | No | `1883` | The host port mapped to the MQTT TCP connection port (`1883`). |
| `MQTT_WS_PORT` | No | `9001` | The host port mapped to the MQTT WebSocket connection port (`9001`). |
| `ADMINER_PORT` | No | `8080` | The host port mapped to Adminer (`8080`), a web database client. |

---

## 2. Server-Side Application Settings (Web App)

These variables are defined in the `web/.env` file (copied from `web/.env.example`). They configure database connections, server-to-broker MQTT communication, and JWT authentication parameters.

| Variable Name | Required | Default / Example Value | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://e_lock:e_lock_ZxcBRK01!@127.0.0.1:5433/elock_db` | Direct PostgreSQL connection string used by Drizzle ORM to connect to the database. |
| `MQTT_BROKER_URL` | Yes | `mqtt://localhost:1883` | Connection URL for the Next.js server to connect to the MQTT broker. |
| `MQTT_USERNAME` | Yes | `elock_mqtt` | Authentication username for the Next.js server to log in to the MQTT broker. |
| `MQTT_PASSWORD` | Yes | `elock_mqtt_2026` | Authentication password for the Next.js server to log in to the MQTT broker. |
| `JWT_SECRET` | Yes | `33ecc5ba31...` | Secret key used to sign and verify user access tokens. |
| `JWT_REFRESH_SECRET` | Yes | `230b04cd7b...` | Secret key used to sign and verify user refresh tokens. |
| `JWT_EXPIRES_IN` | No | `1h` | Time duration for which access tokens remain valid (e.g., `1h`, `15m`). |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Time duration for which refresh tokens remain valid (e.g., `7d`, `30d`). |

---

## 3. Client-Side Application Settings (Next.js Public)

These variables are exposed to the browser. Next.js prefix `NEXT_PUBLIC_` ensures they are bundled into the client build safely.

| Variable Name | Required | Default / Example Value | Description |
|---|---|---|---|
| `NEXT_PUBLIC_MQTT_WS_URL` | Yes | `ws://localhost:9001` | WebSocket URL for the browser client to connect to the MQTT broker for real-time messages. |

<!-- AUTO-GENERATED:END -->

## Setup Instructions

1. **Root Infrastructure:**
   Copy the `.env.example` in the root folder to `.env`:
   ```bash
   cp .env.example .env
   ```
2. **Web Client:**
   Copy the `.env.example` in the `web` folder to `.env`:
   ```bash
   cp web/.env.example web/.env
   ```
3. Update any secrets and passwords in both `.env` files before running `docker compose` or starting the development server.
