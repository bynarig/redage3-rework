# Architecture Decisions

Concise rationale for the non-obvious choices in `server/`, `services/`, and `packages/`. Update this when a decision changes — past records stay below the "Superseded" line.

## Decisions

### Why a gateway resource, not a Kafka client inside every mp.events handler?
RAGE:MP runs your serverside in **a single Node.js process**. If we sprinkled Kafka calls directly into game handlers, every game-logic module would need its own producer and the gateway would become invisible. By keeping the gateway as the *only* RAGE:MP-aware code and putting business logic in headless services, the RAGE:MP process stays simple, restartable, and bounded in responsibility.

### Why Kafka and not RabbitMQ / NATS?
- Per-key ordering (critical for player state) is built-in.
- Replayable log: a new service can backfill by consuming from offset 0.
- Mature consumer-group rebalancing for scaling out.
- KafkaJS is the most stable Node client.

NATS JetStream is a reasonable alternative; pick it if you primarily need request/reply with very low p99 and don't need full log replay.

### Why one shared Postgres instead of database-per-service?
- The legacy C# schema is already a single Postgres DB; splitting it would require rewriting every JOIN before migrating the first feature.
- For a game server with ~hundreds of online players, the access pattern doesn't justify the ops burden.
- Each service is expected to *own* a subset of tables; cross-context reads must go through Kafka commands.

This is a known concession to pragmatism. Revisit when a domain's write volume or schema-evolution cadence becomes a contention point.

### Why Zod schemas instead of Protobuf/Avro + schema registry?
- Zod schemas are TypeScript-native — same definition validates AND types the payload.
- A schema registry is justified once services have independent deploy pipelines and version skew is real. Until then it adds operational weight for no payoff.
- Migration path: Zod → JSON Schema (`zod-to-json-schema`) → Confluent registry when needed.

### Why correlationId-based RPC instead of HTTP between gateway and services?
- Gateway already has a Kafka producer/consumer — one transport, one failure mode.
- Replies survive a gateway restart in-flight (consumed from the reply topic on reboot).
- Lets us mix RPC and fire-and-forget on the same wire.

Cost: ~10–30ms of extra latency vs an HTTP roundtrip. Acceptable for command-style ops (login, character load); we never put a tick-rate loop on RPC.

### Why per-player partition key?
- Kafka guarantees ordering *within* a partition.
- `connected` → `authenticated` → `character_selected` → `position` must be processed in order *per player*, but different players can be processed in parallel.
- `key = rageId` gives both, automatically.

### Why composite TypeScript project refs instead of a single tsconfig?
- Each package builds independently → `pnpm build:packages` is incremental.
- Services can be `tsc --build`-ed in isolation for CI lanes.
- IDE "go to definition" works across packages without a build step (Project References).

## Trade-offs we accepted

- **No DLQ yet** → poison messages will block a partition until they're fixed or rolled past. Acceptable for early dev; add one before the first prod incident.
- **`loginToAccountId` is a hash, not a real key** → the legacy `accounts` table has a composite key. We synthesize a numeric id for envelope tracing until the schema gets a `BIGSERIAL`. See `services/auth/src/repository/account-repo.ts`.
- **Position events are throttled to ~1 Hz** at the gateway. If anti-cheat needs higher frequency, it should subscribe to a separate raw stream the gateway publishes without throttling.

## Superseded
_(none yet)_
