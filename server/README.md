# RedAge JS Serverside

JavaScript/TypeScript serverside for RedAge v3, replacing the legacy C# (`deprecated/dotnet/`) implementation. Built as a **microservices architecture on Kafka**, with a thin RAGE:MP-side gateway resource that bridges in-process game events to the rest of the system.

```
┌──────────────────────────────────────────────────────────────────────┐
│                         RAGE:MP server (node)                        │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                 server/gateway  (@redage/gateway)            │    │
│  │   mp.events  <-->  Kafka producer/consumer/RPC               │    │
│  │   - publishes player/vehicle/world events                    │    │
│  │   - issues commands (auth, character load) via RPC           │    │
│  │   - applies replies to mp.Player                             │    │
│  │   NO game logic, NO DB access                                │    │
│  └──────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────┬────────────────────────────────┘
                                      │  Kafka (KRaft)
                                      ▼
   ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
   │ services/auth    │ │ services/player  │ │ services/<next>  │
   │ argon2 + accounts│ │ characters CRUD  │ │ inventory/econ/…│
   └────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
            └────────────────────┼────────────────────┘
                                 ▼
                         ┌──────────────┐
                         │  PostgreSQL  │
                         │   (Prisma)   │
                         └──────────────┘
```

## Packages

| Path | Name | Purpose |
|---|---|---|
| `packages/contracts` | `@redage/contracts` | Zod schemas for events/commands, envelope shape, topic names. **Single source of truth.** |
| `packages/kafka` | `@redage/kafka` | KafkaJS wrapper: `EventProducer`, `EventConsumer`, `RpcClient`, `Replier`, `ensureTopics`. |
| `packages/logger` | `@redage/logger` | Pino w/ redaction, pretty in dev, JSON in prod. |
| `packages/service-runtime` | `@redage/service-runtime` | Bootstrap: signal handling, graceful shutdown, optional `/healthz` + `/readyz`. |
| `packages/db` | `@redage/db` | Singleton Prisma client. |
| `server/gateway` | `@redage/gateway` | RAGE:MP-side bridge resource. |
| `services/auth` | `@redage/auth-service` | Account login/registration. |
| `services/player` | `@redage/player-service` | Character load/save. |

## Quickstart

```bash
# 1) Bring up Kafka + Postgres + kafka-ui
pnpm infra:up

# 2) Install deps
pnpm install

# 3) Build shared packages (composite refs)
pnpm build:packages

# 4) Start a service in dev (in its own terminal each)
pnpm dev:service:auth
pnpm dev:service:player

# 5) Start the gateway alongside RAGE:MP (or standalone for smoke-test)
pnpm dev:gateway

# Helpful:
#   open http://localhost:8080      # kafka-ui
#   pnpm kafka:topics               # idempotent topic creation
#   pnpm infra:logs                 # tail compose logs
#   pnpm infra:down                 # stop everything
```

## The envelope

Every Kafka message is JSON-wrapped:

```ts
{
  id: "uuid",            // unique per message
  type: "player.connected",
  version: 1,
  occurredAt: "ISO-8601",
  source: "gateway",
  correlationId?: "uuid",  // present on commands AND their replies
  causationId?: "uuid",    // id of the message that caused this one
  replyTo?: "topic",       // commands include this so replier knows where to send the response
  payload: { ... }
}
```

Why: uniform routing, tracing, dedupe, and versioning across services without bespoke per-topic plumbing.

## Events vs Commands vs Replies

| Kind | Topic prefix | Semantics | Reply expected? |
|---|---|---|---|
| **Event** | `game.events.*` | "X happened" — past tense, anyone can subscribe. | No (fan-out). |
| **Command** | `game.commands.*` | "Do X" — exactly one consumer group should handle. | Yes, on `replyTo` keyed by `correlationId`. |
| **Reply** | `game.replies.*` | Response to a command. Topic is owned by the *caller*. | — |

The gateway owns `game.replies.gateway`. Each service that initiates commands should declare its own reply topic (e.g. `game.replies.<service>`).

## Partitioning

Every message uses **the player's RAGE:MP id (or character id / vehicle id) as the Kafka key**. Within a topic, Kafka guarantees per-key ordering — so all events for one player land on one partition and are processed in order. The number of partitions = your max horizontal parallelism per service.

## Adding a new service

1. `mkdir -p services/<name>/src/{handlers,domain,repository}`
2. Copy `services/auth/{package.json,tsconfig.json}` and rename.
3. Add command + reply schemas in `packages/contracts/src/commands/<name>.ts`. Export from `commands/index.ts`. Add topics in `packages/contracts/src/topics.ts`.
4. Implement handlers — pure functions that take `(cmd, envelope, deps)` and call `replier.reply(...)`.
5. Wire them up in `services/<name>/src/index.ts` (mirror `services/auth/src/index.ts`).
6. In the gateway, add a bridge file under `server/gateway/src/bridge/` if the service needs RAGE:MP-side RPC.

## Operational notes

- **Topics are auto-created by the gateway on boot.** In production, provision them out-of-band (`docker/kafka/create-topics.sh` or IaC) and set `auto.create.topics.enable=false`.
- **Idempotent producer** is on; **acks=all**. Safe to retry; KafkaJS handles in-flight ordering.
- **Consumer groups**: one per service. Scaling a service = run more instances with the same `*_CONSUMER_GROUP`; Kafka rebalances partitions.
- **Poison messages** currently re-enter via redelivery. Add a per-service DLQ topic (`game.dlq.<service>`) when you start caring.
- **Shared DB caveat**: services share one Postgres for now. Each service should only write tables in its own bounded context. Cross-context reads should travel by event, not by direct query.
- **Health probes**: set `HEALTH_PORT=8081` (or any) per service. `/healthz` reports liveness, `/readyz` reports kafka-connected.

## Migrating from C#

The legacy server lives in `deprecated/dotnet/` and is no longer built (`csharp: "disabled"` in `conf.json`). Migrate domain-by-domain:

1. Identify a domain in `deprecated/dotnet/` (e.g. `Inventory/`).
2. Map its DB tables → identify the bounded context.
3. Define commands/events in `@redage/contracts`.
4. Implement a new service under `services/<domain>/`.
5. Add a bridge in the gateway for any `mp.events` the old C# handlers used.
6. Cut over and delete the old C# module.

## What this foundation deliberately does NOT include

These are obvious "v2" items, left out to keep the basement load-bearing without being overbuilt:

- **DLQ + retry policy with backoff** — add when you hit your first poison message.
- **Schema registry** (Confluent / Karapace) — Zod schemas in `@redage/contracts` are enough until services are deployed independently.
- **Distributed tracing** (OpenTelemetry) — `correlationId` is already wired; add exporters when you need cross-service spans.
- **Per-service database** — start shared, split when a domain proves its boundaries.
- **mTLS / SASL on Kafka** — single-broker dev cluster; enable for prod.
