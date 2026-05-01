# RedAge Role Play V4 - Modern Rework (NeptuneEvo)

## Development Setup (Quick Start)

Full guide: `docs/development-setup.md`

### Run from project root

**macOS (Apple Silicon)**

```bash
chmod +x scripts/development/macos-arm-development-initialisation.sh
./scripts/development/macos-arm-development-initialisation.sh
```

**Linux (x64)**

```bash
chmod +x scripts/development/linux-x64-development-initialisation.sh
./scripts/development/linux-x64-development-initialisation.sh
```

**Windows (PowerShell)**

Run PowerShell as Administrator, then execute:

```powershell
Set-ExecutionPolicy RemoteSigned -Force
Unblock-File -Path .scripts\development\windows-crossprocessor-development-initialisation.ps1
.\scripts\development\windows-crossprocessor-development-initialisation.ps1
```

---

This is an actively maintained and modernized version of the popular **RedAge V3** gamemode for **RAGE:MP (GTA V)**.

The primary goal of this rework is to transition away from deprecated and difficult-to-maintain technologies, adopting a robust, modern web and backend stack. By introducing modern tooling, ORMs, and a structured monorepo environment, this project aims to deliver a vastly superior Developer Experience (DX) and better maintainability.

---

## Tech Stack Comparison: Deprecated vs Rework

| Feature         | Deprecated Version (V3) | Reworked Version (Current) |
|-----------------|-------------------------|----------------------------|
| **CEF (UI)**    | Svelte / `src_cef`      | Vue 3 / `src_cef_new`      |
| **Client-Side** | `src_client`            | `src_client_new`           |
| **Database**    | Raw SQL Queries         | PostgreSQL + Prisma ORM    |
| **Pkg Manager** | `npm` / `yarn`          | `pnpm@10+` Workspaces      |
| **Localization**| Hardcoded / Custom      | `vue-i18n`                 |

---

## Full Setup Guide

### Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | `>= 20.19.0` |
| [pnpm](https://pnpm.io/installation) | `>= 10.0.0` |
| [PostgreSQL](https://www.postgresql.org/download/) | `>= 14` |
| [.NET Runtime](https://dotnet.microsoft.com/download) | `>= 6.0` |

---

### Step 1 — Download RAGE:MP Server Files

Clone the RAGE:MP server files into a directory that will become your server root:

```bash
git clone https://github.com/efebagri/ragemp-server-files.git ragemp-server
cd ragemp-server
```

This provides the RAGE:MP server binary (`ragemp-server.exe` / Linux binary), `conf.json`, and the required folder structure (`dotnet/`, `client_packages/`, etc.).

---

### Step 2 — Clone This Gamemode

Clone this repository into the server root (the same folder):

```bash
# From inside ragemp-server/
git clone https://github.com/your-org/redage_v3.git .
# or copy the files if you downloaded a ZIP
```

The project files should sit alongside `ragemp-server.exe` and the RAGE:MP `dotnet/` and `client_packages/` directories.

---

### Step 3 — Configure the Database

**Create a PostgreSQL database:**

```sql
CREATE USER bynarig WITH PASSWORD 'bynarig';
CREATE DATABASE redage3 OWNER redage;
```

**Initialize the schema:**

```bash
psql -U redage -d redage3 -f database/main.sql
psql -U redage -d redage3 -f database/mainconfig.sql
psql -U redage -d redage3 -f database/mainlogs.sql
```

**Set the connection string** — create `src_cef_new/.env`:

```env
DATABASE_URL="postgresql://bynarig:bynarig@localhost:5432/redage3?schema=public"
```

Also update `prisma.config.ts` at the root to match the same connection string:

```ts
datasource: {
  url: "postgresql://bynarig:bynarig@localhost:5432/tempdb?schema=public"
}
```

---

### Step 4 — Install Dependencies

```bash
pnpm install
```

---

### Step 5 — Generate Prisma Models

Generate TypeScript Prisma client types into `src_cef_new` and `src_client_new`:

```bash
pnpm prisma:generate
```

To sync the schema and regenerate after any schema changes:

```bash
pnpm prisma:update-models
```

---

### Step 6 — Build the Gamemode

**Production build (all packages):**

```bash
pnpm build
```

This compiles:
- `src_cef_new/` → `client_packages/interface/bundle.js` + `bundle.css`
- `src_client_new/` → `client_packages/main.js`

**Locale-specific CEF builds:**

```bash
pnpm build:ru    # Russian locale
pnpm build:en    # English locale
pnpm build:all   # both locales
```

---

### Step 7 — Configure the Server

Edit `conf.json` in the server root:

```json
{
  "maxplayers": 100,
  "name": "RedAge Roleplay Rework",
  "gamemode": "roleplay",
  "stream-distance": 500.0,
  "announce": false,
  "csharp": "enabled",
  "port": 22005
}
```

Adjust `name`, `maxplayers`, `announce`, and `port` as needed.

---

### Step 8 — Start the Server

**Windows:**

```bash
ragemp-server.exe
```

**Linux: (extract ragemp-srv folder)**

```bash
chmod +x ragemp-server
./ragemp-server
```

The server will start on port `22005` by default.

---

## Development Workflow

### CEF UI in the Browser (macOS / cross-platform)

You can preview and iterate on the Vue interface in any Chromium browser — no GTA V or RAGE:MP client required.

```bash
pnpm dev:cef-new
```

Open **http://localhost:5173** in Chrome. A floating **RAGE:MP Dev Mock** panel appears in the bottom-right corner. It stubs all `window.mp`, `window.events`, `window.router`, and related RAGE:MP globals so the UI loads without throwing.

- `mp.trigger()` calls from the UI are logged to the console (orange).
- Use the panel or `window.mp_mock.emit(eventName, ...args)` in DevTools to push events _into_ the UI, simulating data arriving from the game client.
- All event traffic is printed to the browser console.

> The production build targets Chrome 80 (RAGE:MP's embedded Chromium). Dev mode runs in your local Chrome, which is newer — use [Chrome for Testing 80](https://googlechromelabs.github.io/chrome-for-testing/) if you need pixel-perfect parity.

### Client scripts (watch mode)

```bash
pnpm dev:client-new  # webpack watch mode → client_packages/main.js
```

### Running the Full Server on macOS via Docker

RAGE:MP ships a Linux x86_64 binary only. Docker (with Rosetta on Apple Silicon) lets you run it locally.

**Requirements:** [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)

```bash
# 1. Build the project first so client_packages/ is populated
pnpm build

# 2. Start PostgreSQL + RAGE:MP server
docker compose up --build
```

Docker will:
1. Pull the RAGE:MP Linux binary from `efebagri/ragemp-server-files` during image build
2. Start PostgreSQL on port `5432`, initialize it with the SQL schema files
3. Start the RAGE:MP server on port `22005` (UDP + TCP)

The server mounts `client_packages/`, `conf.json`, `json/`, `settings/`, and `dotnet/resources/` from your local checkout — changes are reflected without rebuilding the image.

```bash
# Stop everything
docker compose down

# Reset the database (drops all data)
docker compose down -v
```

> **Apple Silicon note:** Docker runs the x86_64 binary via Rosetta 2 emulation automatically. First startup is slower; subsequent runs are cached.

---

## Remake Purposes & Key Updates

- **Monorepo Migration:** Switched to a robust `pnpm` workspace architecture for seamless cross-project dependency management.
- **UI Overhaul:** Deprecated the old Svelte frontend in favor of a modern **Vue 3** architecture with native `vue-i18n` localization and Composition API.
- **Database Modernization:** Moved away from raw, hard-to-maintain SQL scripts to **PostgreSQL** powered by **Prisma ORM**, providing fully auto-generated, type-safe models directly into the client and UI resources.
- **Strict TypeScript:** Enforcing strict type-checking and unified code structures in the reworked client-side (`src_client_new`) and CEF (`src_cef_new`) environments.

---

## Community

Website: https://ragemp.pro
Discord: https://discord.gg/edAJjWN
