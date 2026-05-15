# Running RedAge v3

## What runs where

```
┌─────────────────────────────────────────────────────────────────────┐
│ Host machine (your laptop / server)                                 │
│   ragemp-server   ← loads packages/gateway/index.mjs                │
│   pnpm dev:client (webpack --watch)                                 │
│   pnpm dev:cef    (vite dev server)                                 │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ Kafka (localhost:9092)
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│ Docker                                                              │
│   postgres                                                          │
│   kafka (KRaft single-node)                                         │
│   kafka-ui  (dev only)                                              │
│   auth-service-dev / player-service-dev   (dev compose, hot reload) │
│   auth-service     / player-service       (prod compose, built)     │
└─────────────────────────────────────────────────────────────────────┘
```

The RAGE:MP binary is on the host. Frontend bundlers are on the host. Everything
else (DB, Kafka, microservices) runs in Docker.

---

## First-time setup

```bash
# 1) Install workspace deps
pnpm install

# 2) Generate the Prisma client into services/shared/prisma
pnpm prisma:generate

# 3) Verify the foundation builds
pnpm build:server
```

---

## Development (hot reload)

### Option A — dev stack in Docker (recommended)

```bash
# Bring up postgres + kafka + kafka-ui + libs-watcher + service containers.
# Service containers run `tsx watch`; libs-watcher runs `tsc -b --watch`.
# Editing any .ts file in libs/, services/, or server/gateway triggers a
# rebuild + service restart.
pnpm dev:up
```

Logs stream to your terminal. To run detached: `pnpm dev:up:detached`, then
`pnpm dev:logs` to follow.

What's exposed on the host:
- Postgres: `localhost:5432` (user `redage` / password `redage`)
- Kafka:    `localhost:9092`
- Kafka UI: `http://localhost:8080`
- Auth health:   `http://localhost:8081/readyz`
- Player health: `http://localhost:8082/readyz`

To start the RAGE:MP side (host):
```bash
# In separate terminals:
pnpm dev:client     # webpack watch -> client_packages/main.js
pnpm dev:cef        # vite dev -> CEF bundle
pnpm build:gateway  # one-time; rebuild whenever the gateway src changes

# Then start RAGE:MP itself:
./ragemp-server
```

> The gateway is loaded by RAGE:MP at startup via `packages/gateway/index.mjs`
> → it `import`s `server/gateway/dist/index.js`. So you must have run
> `pnpm build:gateway` (or `pnpm dev:libs:watch` on host) before the binary
> starts.

### Option B — pure host-side dev (no Docker for services)

If you prefer everything on the host:
```bash
pnpm infra:up                       # only postgres + kafka in Docker
pnpm dev:libs:watch                 # tsc -b --watch in one terminal
pnpm dev:service:auth               # tsx watch in another
pnpm dev:service:player             # tsx watch in another
pnpm dev:client                     # webpack
pnpm dev:cef                        # vite
./ragemp-server
```

---

## Production

```bash
# 1) Provide secrets
cp docker/.env.example docker/.env
$EDITOR docker/.env                # set real POSTGRES_PASSWORD, etc.

# 2) Build the service images (cached on subsequent runs).
pnpm prod:build

# 3) Start the stack.
pnpm prod:up

# Observe:
pnpm prod:ps
pnpm prod:logs

# Tear down (keeps volumes):
pnpm prod:down
```

In production, the RAGE:MP server still runs on the host (or a separate
host) and connects to Kafka on `${KAFKA_HOST}:${KAFKA_HOST_PORT}` from
`docker/.env`. Make sure that resolves from where RAGE:MP runs.

For multi-host production, replace `localhost` advertised listeners with
the real broker hostname so RAGE:MP and any external services can reach it.

---

## What "hot reload" actually covers

| Change                          | Reload behavior                          |
|---------------------------------|-------------------------------------------|
| `services/auth/src/*.ts`        | tsx watch restarts auth-service-dev      |
| `services/player/src/*.ts`      | tsx watch restarts player-service-dev    |
| `libs/contracts/src/*.ts`       | tsc rebuilds dist/ → both services reload |
| `libs/kafka/src/*.ts`           | same as above                             |
| `services/shared/src/*.ts`      | tsc rebuilds → both services reload      |
| `database/prisma/schema.prisma` | run `pnpm prisma:generate` manually      |
| `server/gateway/src/*.ts`       | rebuild gateway; restart RAGE:MP         |
| `src_cef/src/*.{ts,vue}`        | vite HMR                                  |
| `src_client/src/*.ts`           | webpack --watch rebuilds; reconnect player|

The gateway is the one piece that can't hot-reload without restarting
RAGE:MP itself (RAGE:MP loads it once at boot via require/import).

---

## Common issues

- **`@redage/gateway not built`** when starting `ragemp-server` → run `pnpm build:gateway` first.
- **Services can't reach Kafka** → check `KAFKA_BROKERS`. Inside dev compose it's `kafka:9094`; from the host it's `localhost:9092`.
- **Prisma errors on first run** → `pnpm prisma:generate` then `pnpm build:libs`.
- **bind-mount permission errors on Linux** → ensure your UID matches the `node` user in the dev image, or drop the `USER app` line in `Dockerfile.dev` for local-only development.
- **Hot reload not picking up changes on macOS/WSL** → the `tsx watch` and `tsc --watch` paths use native fsevents inside the container. If polling is needed, add `--watch-preserve-output` plus `CHOKIDAR_USEPOLLING=1` to the service container env.
