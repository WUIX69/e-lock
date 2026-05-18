# Contributing to E-LOCK

Thank you for contributing to E-LOCK! This guide details the development environment setup, available commands, coding standards, and procedures to ensure clean and secure submissions.

---

## 1. Prerequisites

Before setting up the environment, ensure you have the following installed:
- **Node.js**: v18.0.0 or later (Recommended: v20 LTS)
- **pnpm**: v11.x (used as the primary package manager for the monorepo)
- **Docker & Docker Compose**: For local PostgreSQL database and Mosquitto MQTT broker infrastructure
- **Google Antigravity IDE** or VS Code
- **PlatformIO**: For working with ESP32 firmware in `firmware/`

---

## 2. Development Setup

Follow these steps to set up a local development environment:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd e-lock
   ```

2. **Install monorepo dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create local configuration files from the templates:
   ```bash
   cp .env.example .env
   cp web/.env.example web/.env
   ```
   *Note: Open `web/.env` and update the `JWT_SECRET` and database credentials with secure values for local use.*

4. **Spin Up Local Infrastructure (Docker):**
   Start the PostgreSQL database and Mosquitto MQTT broker containers:
   ```bash
   pnpm docker:up
   ```

5. **Initialize and Seed the Database:**
   Push the Drizzle schemas and populate mock data (employees, locks, etc.):
   ```bash
   pnpm db:push
   pnpm --filter @e-lock/web db:seed
   ```

6. **Start Web Development Server:**
   Launch the Next.js development server with turbopack:
   ```bash
   pnpm dev
   ```

---

## 3. Available Command Reference

We use a monorepo workspace managed via `pnpm`. Below is the complete list of available root commands:

<!-- AUTO-GENERATED:SCRIPTS_START -->

### Root Monorepo Commands

| Command | Native Execution | Description |
|---|---|---|
| `pnpm dev` | `pnpm --filter @e-lock/web dev` | Starts the Next.js web application dev server on `http://localhost:3000` |
| `pnpm build` | `pnpm --filter @e-lock/web build` | Compiles the Next.js production build bundle |
| `pnpm lint` | `pnpm --filter @e-lock/web lint` | Runs the ESLint checker across the web application |
| `pnpm typecheck` | `pnpm --filter @e-lock/web typecheck` | Runs the TypeScript compiler check (`tsc --noEmit`) to verify types |
| `pnpm format` | `pnpm --filter @e-lock/web format` | Formats all source files with Prettier |
| `pnpm docker:up` | `docker compose up -d` | Spins up PostgreSQL and Mosquitto containers in the background |
| `pnpm docker:down` | `docker compose down` | Stops and removes active container instances |
| `pnpm docker:logs` | `docker compose logs -f` | Follows logs from running Docker services in real-time |
| `pnpm docker:reset` | `docker compose down -v` | Safely stops containers and deletes their volumes (destroys DB data) |
| `pnpm db:push` | `drizzle-kit push` | Pushes local changes in `schema.ts` directly to the active database |
| `pnpm db:generate` | `drizzle-kit generate` | Generates SQL migration files from changes made to the Drizzle schema |
| `pnpm db:migrate` | `drizzle-kit migrate` | Executes pending SQL migration files against the database |
| `pnpm db:check` | `drizzle-kit check` | Performs a compatibility check on schema and migration files |
| `pnpm db:studio` | `drizzle-kit studio` | Starts Drizzle Studio web database GUI (usually on `http://127.0.0.1:4983`) |
| `pnpm validate` | `pnpm lint && pnpm typecheck && pnpm db:check` | Runs the complete validation pipeline (linting, types, and DB checks) |

### Web Workspace-Specific Commands

These can be run directly inside `web/` or via `--filter @e-lock/web`:
- `pnpm db:seed`: Populates the database with default personnel and device profiles.
- `pnpm start`: Runs the compiled Next.js production server locally.

<!-- AUTO-GENERATED:SCRIPTS_END -->

---

## 4. Coding Standards

To maintain clean, readable, and highly optimized code, all contributions must strictly adhere to the following standards:

### TypeScript & React
- **Interfaces Over Types:** Use TypeScript `interface` instead of `type` aliases whenever defining props or domain structures.
- **Strict Typing:** Avoid `any` type. Define clear interfaces for all parameters, state items, and API responses. Do not use type casting (`as` keyword) unless absolutely unavoidable. Use type guards instead.
- **Component Style:** Always use arrow functions for components (e.g. `const MyComponent = () => { ... }`).
- **Control Flow:** Favor **early returns** (`if (!data) return;`) over deeply nested block scopes.
- **descriptive Naming:** Avoid shorthands or 1-2 character variables in map loops or operations. Prefix event handler functions with `handle` (e.g. `handleToggleClick`).

### Styling & CSS
- **Tailwind CSS Only:** Use Tailwind utility classes for styling. Do not write custom CSS unless completely unavoidable.
- **Conditional Classes:** Always use the `cn()` utility (combining `clsx` and `tailwind-merge`) for styling that changes dynamically, rather than nested ternary operators.

### Quality Verification
- Before submitting your code, make sure to clean up all unused variables, debugging statements (`console.log`), and ensure a fully working build.
- Prevent lint and type errors by running the validation suite locally:
  ```bash
  pnpm validate
  ```

---

## 5. Pull Request Checklist

Before submitting a Pull Request, ensure:
1. [ ] The local development server runs with zero console warnings/errors.
2. [ ] All changes pass type checking and linting checks via `pnpm validate`.
3. [ ] Code follows the React arrow function, early return, and explicit typing rules.
4. [ ] Any new or updated environment variables are added to `.env.example` files and documented in [ENV.md](file:///c:/projects/e-lock/docs/ENV.md).
5. [ ] Relevant tests are updated/created and pass cleanly.
