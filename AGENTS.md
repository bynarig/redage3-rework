# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

RedAge Role Play v3 — a GTA V multiplayer gamemode for RAGE:MP. The project is a TypeScript/Vue 3 monorepo managed with pnpm workspaces, targeting the RAGE:MP runtime environment.

## Commands

```bash
# Install dependencies
pnpm install

# Build everything (parallel)
pnpm build

# Build CEF (Vue UI)
pnpm build:cef-new          # default locale
pnpm build:ru               # Russian locale
pnpm build:en               # English locale
pnpm build:all              # both locales

# Build client scripts
pnpm build:client-new

# Development
pnpm dev:cef-new            # Vue dev server with HMR
pnpm dev:client-new         # webpack watch mode for client scripts

# Type checking
pnpm type-check

# Linting
pnpm lint

# Tests
pnpm test                   # unit tests (Vitest)
pnpm test:e2e               # E2E tests (Playwright, from src_cef_new/)

# Database
pnpm prisma:generate        # regenerate Prisma client types
pnpm prisma:update-models   # sync schema changes to client/CEF model copies
```

## Architecture

### Workspaces

The monorepo has four workspace packages:
- **`src_cef_new/`** — Vue 3 + Vite frontend (CEF/browser UI rendered inside RAGE:MP's embedded Chromium 80)
- **`src_client_new/`** — TypeScript client scripts bundled with webpack (runs in RAGE:MP's V8/ES2017 engine — no DOM, no modern browser APIs)
- **`src_cef/`** and **`src_client/`** — legacy Svelte/JS implementations, kept for reference during migration

### CEF Frontend (`src_cef_new/`)

Vue 3 SPA with Pinia state management and vue-i18n. Builds to a single `bundle.js` + `bundle.css` output (RAGE:MP CEF requires a single-file bundle). Targets Chrome 80 — avoid APIs introduced after Chrome 80. State in Pinia stores is the source of truth; stores receive data from the game client via `mp.events` bridged through the window object.

### Client Scripts (`src_client_new/`)

Module-based system under `src/modules/` (21 modules: admin, animation, battlepass, business, casino, fractions, house, inventory, phone, player, shop, vehicles, world, polygons, synchronization, events, camera, etc.). Compiles to a single UMD bundle (`client_packages/main.js`). TypeScript is configured with `lib: []` — no DOM types available; only RAGE:MP global types and ES2017 standard library.

### Data Flow

```
PostgreSQL ←→ C# (.NET dotnet/) ←→ RAGE:MP server ←→ Client scripts (src_client_new)
                                                              ↕ mp.events bridge
                                                         CEF/Vue UI (src_cef_new)
```

The C# layer in `dotnet/` handles server-side game logic. Client scripts communicate with the UI via `mp.trigger` / `mp.events.add` (RAGE:MP's IPC mechanism).

### Database

PostgreSQL with Prisma ORM (`database/prisma/schema.prisma`). The schema generates two client targets — one for CEF and one for client scripts — synced via `prisma:update-models`. Connection string is in `src_cef_new/.env`.

### Static Game Data

`json/` at the root contains 54 JSON files with character customization options (clothes, tattoos, barber options, etc.) used by both the frontend and game logic.

### Build Outputs

Compiled artifacts land in `client_packages/`:
- `interface/bundle.js` + `interface/bundle.css` — compiled CEF UI
- `main.js` — compiled client scripts

These are what RAGE:MP loads at runtime.

## Key Constraints

- **Client scripts target ES2017** — no optional chaining (`?.`), nullish coalescing (`??`), or other post-ES2017 syntax in `src_client_new/`
- **CEF targets Chrome 80** — check browser compatibility for any new Web APIs
- **No DOM in client scripts** — `document`, `window`, `fetch`, etc. are unavailable; use RAGE:MP APIs only
- **pnpm only** — npm and yarn are not used; `.npmrc` disables shamefully-hoist with `node-linker=isolated`
- **Prettier config** — 120 char line width, 4 spaces, trailing commas off (see `src_cef_new/.prettierrc.json`)
