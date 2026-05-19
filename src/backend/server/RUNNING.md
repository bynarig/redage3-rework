# Running RedAge v3 end-to-end

Start sequence for the full stack: Postgres + Kafka → microservices → RAGE:MP server → client/CEF. Every step assumes you're at the repo root.

## One-time setup

```bash
# 1. Install pnpm workspaces
pnpm install

# 2. Generate the Prisma client into services/shared/prisma/
pnpm prisma:generate

# 3. Build everything server-side
pnpm build:server          # libs/* + services/shared + services/* + server/gateway
```

`pnpm build:server` is the umbrella — run this after every server-side code change before starting `ragemp-server`. The RAGE:MP shim at `packages/gateway/index.mjs` will refuse to load if `server/gateway/dist/` is missing.

## Database

The repo's `database/prisma.config.ts` points at `postgresql://bynarig:bynarig@localhost:5432/tempdb`. If that database doesn't exist yet, either:

**Option A — use your own local Postgres** (already running on 5432):
```bash
createdb tempdb                                                # one-time
psql tempdb < database/main_rework.sql                         # schema
psql tempdb < database/main_insert_rework.sql                  # seed data
export DATABASE_URL="postgresql://bynarig:bynarig@localhost:5432/tempdb?schema=public"
```

**Option B — use the docker compose Postgres**:
Edit `docker/docker-compose.yml` to use the same creds as `prisma.config.ts`, or update `prisma.config.ts` to match `postgres://redage:redage@localhost:5432/redage`. Then:
```bash
pnpm infra:up
psql -h localhost -U redage redage < database/main_rework.sql
export DATABASE_URL="postgresql://redage:redage@localhost:5432/redage?schema=public"
```

## Kafka

Required for the gateway and every service to talk to each other. Spin up via docker:

```bash
pnpm infra:up               # kafka (KRaft), kafka-ui (http://localhost:8080), postgres
pnpm kafka:topics           # idempotent — also auto-runs from gateway on first boot
```

Verify: open http://localhost:8080 — you should see the broker and the `game.events.*` / `game.commands.*` / `game.replies.gateway` topics.

## Services (one terminal each)

Each service is a long-running Node process. The handlers connect to Kafka, consume their command topic, hit Postgres via Prisma, and reply back.

```bash
# terminal 1
KAFKA_BROKERS=localhost:9092 \
DATABASE_URL="postgresql://bynarig:bynarig@localhost:5432/tempdb?schema=public" \
pnpm dev:service:auth

# terminal 2
KAFKA_BROKERS=localhost:9092 \
DATABASE_URL="postgresql://bynarig:bynarig@localhost:5432/tempdb?schema=public" \
pnpm dev:service:player
```

`dev:*` uses `tsx watch` — handlers reload on save. For prod, run `pnpm build:services` then `node services/<name>/dist/index.js`.

You should see, for each service:
```
{"level":30,"service":"auth-service",...} "kafka consumer running"
{"level":30,"service":"auth-service",...} "auth-service online"
```

## Client + CEF bundles

The client scripts and the CEF UI must be built so RAGE:MP can serve them to connecting players:

```bash
pnpm build:client          # webpack -> client_packages/main.js
pnpm build:cef             # vite     -> client_packages/interface/bundle.js
```

## RAGE:MP server

`conf.json` already has `csharp: "disabled"` and `enable-nodejs: true`. The Node loader (`bin/loader.mjs`) will pick up `packages/gateway/index.mjs`, which `import()`s the compiled `server/gateway/dist/index.js`.

```bash
# from repo root
KAFKA_BROKERS=localhost:9092 \
DATABASE_URL="postgresql://bynarig:bynarig@localhost:5432/tempdb?schema=public" \
LOG_LEVEL=info \
./ragemp-server
```

Expected boot log:
```
[INFO] Loading NodeJS packages...
[DONE] "gateway" package has been loaded.
[INFO] Starting packages...
{"level":30,"service":"gateway",...} "kafka producer connected"
{"level":30,"service":"gateway",...} "rpc client started"
{"level":30,"service":"gateway",...} "all topics already exist"
{"level":30,"service":"gateway",...} "gateway online"
[DONE] Server packages have been started.
```

## Smoke test the full path

1. Connect to the server with the RAGE:MP client (`localhost:22005`).
2. The CEF UI should mount. From your login Vue component:
   ```ts
   import { useAuth } from '@/composables/useAuth'
   const auth = useAuth()
   const ok = await auth.login('testuser', 'password123')
   console.log(auth.account.value, auth.error.value)
   ```
3. Trace in logs:
   - **CEF**: `mp.trigger('redage.auth.login', ...)`
   - **client**: `src_client/src/modules/auth` forwards via `mp.events.callRemote`
   - **gateway**: publishes envelope to `game.commands.auth`, awaits reply on `game.replies.gateway`
   - **auth-service**: consumes, runs argon2, writes reply
   - **gateway**: gets reply, `player.call('redage:auth:reply', ...)`
   - **client**: bridges back to CEF via `mp.gui.execute("listernEvent(...)")`
   - **CEF**: `useAuth()` updates `account.value`

If anything stalls, check kafka-ui to see where the message stopped — every step writes to a Kafka topic.

## Common issues

| Symptom | Cause | Fix |
|---|---|---|
| `gateway package loading failed: dist/index.js not found` | Built the libs but not the gateway. | `pnpm build:gateway` |
| `KafkaJSConnectionError: getaddrinfo ENOTFOUND kafka` inside ragemp-server | The server resolves Kafka with the `localhost:9092` advertised listener, fine. If you put `kafka:9094` you'd need it inside docker. | Set `KAFKA_BROKERS=localhost:9092` in the shell that launches `ragemp-server`. |
| `Cannot find module '@redage/contracts'` at runtime | pnpm symlinks not present next to the dist file. | `pnpm install` from repo root before `pnpm build:server`. |
| Auth times out after 10s | `auth-service` isn't running or isn't joined to the consumer group. | Check terminal where you launched `pnpm dev:service:auth`. |
| Position never persists | `player-service` isn't running, OR the player never finished `player.character_selected`. | Verify in kafka-ui that `player.save_character` messages are being produced. |
| Prisma errors `Unknown arg 'pos'` | Schema changed and client wasn't regenerated. | `pnpm prisma:generate && pnpm build --filter @redage/shared` |

## TL;DR commands

```bash
# fresh boot from cold
pnpm install
pnpm prisma:generate
pnpm build:server
pnpm build:client && pnpm build:cef
pnpm infra:up

# in separate terminals
pnpm dev:service:auth
pnpm dev:service:player

# finally
./ragemp-server
```
