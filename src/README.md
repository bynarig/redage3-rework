# RedAge v3 — End-to-End Flow: CEF → Microservice → DB

This document traces a single user action from the Vue UI inside RAGE:MP's CEF
browser all the way to a Postgres row, and the reply back. It is grounded in
the actual code under `src/` — every event name and file path here is real.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  CEF (Chromium 80, Vue 3)            src/frontend/cef/                       │
│   Vue component  →  composable  →  api/rage.ts → window.mp.trigger(...)      │
└─────────────────────────────────┬────────────────────────────────────────────┘
                                  │  mp.trigger        (in-process IPC)
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  Client bundle (V8/ES2017)           src/frontend/client/                    │
│   mp.events.add('redage.x.y') → mp.events.callRemote('redage:x:y', ...)      │
└─────────────────────────────────┬────────────────────────────────────────────┘
                                  │  callRemote        (network → RAGE:MP server)
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  Gateway resource (Node, in RAGE:MP) src/backend/server/gateway/             │
│   mp.events.add('redage:x:y') →  RpcClient.call({ topic, key, type })        │
│   (or producer.publish for fire-and-forget events)                           │
└─────────────────────────────────┬────────────────────────────────────────────┘
                                  │  Kafka (KRaft) — envelope JSON, key=rageId
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  Microservices                       src/backend/services/{auth,player}/     │
│   EventConsumer → handler → Repository → Prisma → PostgreSQL                 │
│   Replier.reply(...) ─────────────────────────────────────────────┐          │
└──────────────────────────────────────────────────────────────────┬┘          │
                                                                   ▼           │
                                                  Kafka replyTo (game.replies.gateway)
                                                                   │
                              ┌────────────────────────────────────┘
                              ▼
   Gateway RpcClient resolves the pending promise on matching correlationId.
   Gateway calls back to the player: player.call('redage:x:reply', payload).
                              │
                              ▼          mp.events.add('redage:x:reply') in client
                       Client bundle  → executeCef("window.listernEvent(...)")
                              │
                              ▼          window.functionList[event](payload)
                       CEF composable updates a Vue ref → UI re-renders.
```

The system has three independent runtimes — the CEF browser (Chromium 80), the
RAGE:MP client (V8/ES2017, no DOM), and the RAGE:MP server (Node) — connected
by two IPC layers and one message bus.

---

## Layer 1 — CEF (`src/frontend/cef/`)

Vue 3 SPA bundled to a single `bundle.js` + `bundle.css` and loaded by the
RAGE:MP browser via `package://interface/index.html`.

### Sending: composable → `api/rage.ts` → `mp.trigger`

`src/frontend/cef/src/api/rage.ts`:

```ts
export const executeClient = (eventName, ...args) => {
    if ((window as any).mp !== undefined) {
        (window as any).mp.trigger(eventName, ...args)
    }
}
```

`mp` is injected by the RAGE:MP CEF host. `mp.trigger` raises an event that the
client bundle (Layer 2) hears via `mp.events.add`. The CEF side never speaks to
Kafka or Postgres directly — it only knows event names.

### Receiving: `listernEvent` bridge → `addListernEvent`

CEF cannot listen to RAGE:MP events directly. Instead the client bundle
**executes JS inside the browser** that calls a global `window.listernEvent`:

`src/frontend/cef/src/api/functions.ts`:

```ts
window.listernEvent = (eventName, ...args) => {
    if (typeof window.functionList?.[eventName] === 'function') {
        window.functionList[eventName](...args)
    }
}

export const addListernEvent = (eventName, func) => {
    if (typeof window.functionList !== 'object') window.functionList = {}
    window.functionList[eventName] = func
    if (getCurrentInstance()) onUnmounted(() => { delete window.functionList?.[eventName] })
}
```

Composables in `src/frontend/cef/src/composables/` (e.g. `useAuth.ts`,
`useCharacter.ts`, `useCustomization.ts`) register handlers with
`addListernEvent` and expose reactive refs to the Vue components.

`useAuth.ts` shows the canonical request/response pattern:

```ts
addListernEvent('redage:auth:reply', (rawReply) => {
    const parsed = AuthReplySchema.safeParse(rawReply)
    loading.value = false
    pending?.(parsed.success && parsed.data.ok)
    pending = null
})

function call(eventName, ...args): Promise<boolean> {
    if (pending) return Promise.resolve(false)   // one-in-flight contract
    loading.value = true
    return new Promise((resolve) => {
        pending = resolve
        executeClient(eventName, ...args)        // → Layer 2
    })
}
```

`AuthReplySchema` is a Zod schema in `src/frontend/cef/src/api/contracts/auth.ts`
that validates the payload coming back from the server. Anything that fails
parsing turns into a UI error — server changes can't silently corrupt UI state.

---

## Layer 2 — Client bundle (`src/frontend/client/`)

TypeScript bundled with webpack into a single UMD file
(`client_packages/main.js`) that RAGE:MP loads on connect. `lib: []` in
tsconfig — there is **no DOM and no fetch**; only RAGE:MP globals.

`src/frontend/client/index.ts` is purely side-effect imports of bridge modules:

```ts
import '@/src/modules/system-controls'
import '@/src/modules/cef'           // creates the CEF browser
import '@/src/modules/hud'
import '@/src/modules/auth'
import '@/src/modules/character'
import '@/src/modules/customization'
```

### `modules/cef/index.ts` — owns the browser

Creates the main browser, tracks DOM-ready state, and exports `executeCef`
which runs arbitrary JS inside the CEF context. This is how server replies are
funneled back into Vue (see `emitToCef` below).

### Bridge modules: relay-only, no logic

Each bridge module has the same shape. Example —
`src/frontend/client/src/modules/auth/index.ts`:

```ts
// CEF → server
mp.events.add('redage.auth.login', (login, password) => {
    mp.events.callRemote('redage:auth:login', login, password)
})

// server → CEF
mp.events.add('redage:auth:reply', (reply: AuthReply) => {
    if (reply.ok && reply.account) state.loggedIn = true
    emitToCef('redage:auth:reply', reply)
})

function emitToCef(eventName, ...args) {
    const payload = [eventName, ...args].map((a) => JSON.stringify(a)).join(',')
    executeCef(`window.listernEvent && window.listernEvent(${payload});`)
}
```

Naming convention worth memorising:

| Direction              | Event name format                | Mechanism                      |
|------------------------|----------------------------------|--------------------------------|
| CEF → client           | `redage.<domain>.<action>` (dots)| `mp.trigger`                   |
| client → server        | `redage:<domain>:<action>` (colons) | `mp.events.callRemote`     |
| server → client        | `redage:<domain>:reply` (colons) | `player.call(...)` from server |
| client → CEF           | `redage:<domain>:reply` (colons) | `executeCef` → `listernEvent`  |

The character bridge (`modules/character/index.ts`) and customization bridge
(`modules/customization/index.ts`) follow the same pattern. Customization also
runs game-side effects locally (camera, model overlay preview) without bothering
the server — only the final save is forwarded.

---

## Layer 3 — Gateway (`src/backend/server/gateway/`)

Runs inside the RAGE:MP node process. It is the **only** code that knows about
both `mp.events` and Kafka. It owns no business logic.

### Bootstrap — `src/backend/server/gateway/src/index.ts`

1. Connect to Kafka, ensure topics exist (`ensureTopics(...)`).
2. Boot an `EventProducer` (fire-and-forget) and an `RpcClient` (request/reply).
3. Create a `SessionRegistry` — per-player bookkeeping (accountId, characterId,
   throttle timestamps).
4. If `mp` global is present (i.e. running inside RAGE:MP), register bridges:
   - `registerPlayerEventBridge` — playerJoin/playerQuit/playerDeath/position
   - `registerAuthBridge`        — login, register
   - `registerCharacterBridge`   — create, select, customization save, autosave

### Three flavours of bridge

**(a) Fire-and-forget event** — `bridge/player-events.ts`:

```ts
mp.events.add('playerJoin', (player) => {
    sessions.create(player.id)
    void producer.publish({
        topic: Topics.PlayerEvents,
        key: String(player.id),                  // partition key = rageId
        type: 'player.connected',
        payload: { rageId: player.id, ... },
    })
})
```

Position telemetry is throttled (`positionThrottleMs`, default 1 Hz) before
publishing — see `redage:position`. The throttle lives on the session, not the
service, because the gateway is what produces the spam.

**(b) RPC** — `bridge/auth-bridge.ts`:

```ts
mp.events.add('redage:auth:login', (...args) => {
    const player = args[0] as Mp.Player
    void (async () => {
        const reply = await rpc.call<AuthReply>({
            topic: Topics.AuthCommands,
            key: String(player.id),
            type: 'auth.login',
            payload: { rageId: player.id, login, password, ...identity },
        })
        if (reply.payload.ok && reply.payload.account) {
            const session = sessions.get(player.id)
            session.accountId   = reply.payload.account.id
            session.accountLogin = reply.payload.account.login
        }
        player.call('redage:auth:reply', [reply.payload])     // → Layer 2
    })()
})
```

**(c) Mixed RPC + game-state mutation** — `bridge/character-bridge.ts` does
`rpc.call('player.load_character')` and, on success, **applies** the result to
the RAGE:MP player object (`player.position`, `player.heading`, `player.health`,
`player.model`, head overlays via `applyAppearance`). Then it publishes a
follow-up `player.character_selected` event so other services can react.

It also owns a 60s autosave timer that walks `mp.players` and emits a
fire-and-forget `player.save_character` command per session that has a
character loaded.

### Session registry — `gateway/src/session.ts`

In-memory `Map<rageId, PlayerSession>`. Holds only what's needed to bridge
between RAGE:MP and Kafka — `accountId`, `accountLogin`, `characterId`,
`connectedAt`, `lastPositionSentAt`. Anything durable lives in the service DB.

---

## Layer 4 — Kafka transport (`src/backend/libs/{contracts,kafka}/`)

### The envelope

Every message on Kafka is wrapped in a JSON envelope
(`libs/contracts/src/envelope/envelope.ts`):

```ts
{
  id: "uuid",
  type: "auth.login",
  version: 1,
  occurredAt: "ISO-8601",
  source: "gateway",
  correlationId?: "uuid",   // present on commands + their replies
  causationId?:   "uuid",   // id of the message that caused this one
  replyTo?:       "topic",  // present on commands; tells the replier where to go
  payload: { ... }
}
```

Validated with Zod; every consumer parses the envelope before dispatching.

### Topics — `libs/contracts/src/topics.ts`

```
game.events.player       ← gateway publishes player lifecycle
game.events.vehicle      ← (placeholder)
game.events.inventory    ← (placeholder)
game.events.economy      ← (placeholder)
game.events.world        ← (placeholder)

game.commands.auth       ← gateway → auth-service
game.commands.player     ← gateway → player-service
game.commands.inventory  ← (placeholder)
game.commands.economy    ← (placeholder)

game.replies.gateway     ← any service → gateway (correlationId-routed)
```

Partition key is always the player's `rageId` (or character/vehicle id). That
guarantees per-player ordering within a topic while letting different players
process in parallel on different partitions.

### RPC over Kafka — `libs/kafka/src/{rpc.ts,replier.ts}`

`RpcClient.call(...)` builds a correlationId, publishes the command with
`replyTo = game.replies.gateway`, and stores a resolver in a `Map`. A consumer
on the reply topic matches incoming envelopes by `correlationId` and resolves
the pending promise. Default timeout: 10s.

`Replier.reply({ incoming, type, payload })` on the service side echoes
`correlationId` and sets `causationId = incoming.id`, then publishes to
`incoming.replyTo`. The replier refuses to send if `replyTo` or `correlationId`
is missing — guards against accidentally turning a fire-and-forget event into
a half-RPC.

### Producer / Consumer — `libs/kafka/src/{producer.ts,consumer.ts}`

- **Producer**: idempotent (`idempotent: true`, `acks: -1`), no auto-topic
  creation. Sets `x-envelope-id`, `x-envelope-type`, `x-source`, and conditional
  `x-correlation-id` / `x-reply-to` headers for grep-ability in `kafka-ui`.
- **Consumer**: routes `(topic, envelope.type) → handler`. Each handler
  registers its Zod schema; the payload is parsed before dispatch. Unrecognised
  types are silently skipped (logged at `debug`). Invalid envelopes are
  logged at `error` and skipped. Failures bubble — Kafka does not advance the
  offset, so messages are retried after session timeout. No DLQ yet
  (see `server/ARCHITECTURE.md`).

---

## Layer 5 — Services (`src/backend/services/`)

Each service is a headless Node process: bootstrap → kafka consumer + replier →
handler registrations → wait for shutdown.

### `services/auth/` — login & register

`services/auth/src/index.ts`:

```ts
consumer.on(Topics.AuthCommands, 'auth.login', LoginCommand, async (cmd, env) => {
    await handleLogin(cmd, env, { repo, replier, logger })
})
consumer.on(Topics.AuthCommands, 'auth.register', RegisterCommand, async (cmd, env) => {
    await handleRegister(cmd, env, { repo, replier, logger })
})
```

Handlers are pure functions over `(command, envelope, deps)`. `handleLogin`:

1. Lookup account via `AccountRepository`.
2. Verify password with `argon2.verify`.
3. `repo.touchLogin` + `repo.createSession` (Postgres writes).
4. `replier.reply({ incoming: envelope, type: 'auth.reply', payload })` →
   publishes the response to `envelope.replyTo` with the same `correlationId`.

### `services/player/` — character CRUD

Same shape with four handlers:
- `player.load_character`     → returns CharacterDto, gateway applies to mp.Player
- `player.save_character`     → fire-and-forget, called by the 60s autosave
- `player.create_character`   → RPC, returns characterId
- `player.save_customization` → fire-and-forget after barber save

### Shared DB — `src/backend/services/shared/`

One Postgres instance, one Prisma client (`@redage/shared` exposes
`getPrisma()` / `disconnectPrisma()`). Each service writes only tables in its
own bounded context; cross-context reads should travel by event, not by direct
query. See `src/backend/server/ARCHITECTURE.md` for the rationale and the
known concession.

---

## Worked example — login

1. **Vue** — User submits the login form. The component calls
   `const { login } = useAuth(); await login('joe', 'secret')`.
2. **Composable** — `useAuth` flips `loading=true`, stores a `pending` resolver,
   and calls `executeClient('redage.auth.login', 'joe', 'secret')`.
3. **api/rage.ts** — `window.mp.trigger('redage.auth.login', 'joe', 'secret')`.
4. **Client bundle** — `modules/auth/index.ts` hears the trigger and forwards
   `mp.events.callRemote('redage:auth:login', 'joe', 'secret')`.
5. **Gateway bridge** — `bridge/auth-bridge.ts` builds the LoginWire payload
   (`rageId`, `login`, `password`, `hwid`, `ip`, `socialClub`) and calls
   `rpc.call({ topic: 'game.commands.auth', key: rageId, type: 'auth.login', payload })`.
6. **Kafka** — Envelope lands on `game.commands.auth` with a fresh
   `correlationId` and `replyTo='game.replies.gateway'`. Key = `rageId` →
   ordered per-player.
7. **auth-service** — Consumer routes on `(topic, type)` → `handleLogin`. It
   reads the account, verifies argon2, touches login, creates a session row.
8. **Reply** — `replier.reply({ type: 'auth.reply', payload: { ok: true, account } })`
   publishes to `game.replies.gateway` echoing the original `correlationId`.
9. **Gateway RpcClient** — Sees the reply envelope, matches `correlationId`,
   resolves the pending promise. Bridge stores `accountId`/`accountLogin` on
   the session, then `player.call('redage:auth:reply', [payload])`.
10. **Client bundle** — `mp.events.add('redage:auth:reply', ...)` flips
    `state.loggedIn = true` and `emitToCef('redage:auth:reply', reply)` injects
    a `listernEvent` call into the browser.
11. **CEF** — `window.listernEvent('redage:auth:reply', reply)` finds the
    `useAuth` handler in `window.functionList`. It validates with
    `AuthReplySchema`, sets `account.value = reply.account`, resolves the
    `pending` promise → the original `await login(...)` returns `true`.

End-to-end latency budget (observed in `ARCHITECTURE.md`): a Kafka RPC
roundtrip adds ~10–30 ms vs an HTTP roundtrip; argon2 verify dominates.

---

## Adding a new flow — checklist

1. Define the wire shape as a Zod schema in
   `src/backend/libs/validators/src/<domain>.ts` and re-export from `index.ts`.
2. Wrap it in a Command (and Reply, if RPC) in
   `src/backend/libs/contracts/src/commands/<domain>.ts`. Add the topic to
   `topics.ts` if it's a new bounded context.
3. **Service**: copy the shape of `services/auth/src/index.ts`. Register the
   handler with `consumer.on(topic, type, schema, handler)`. Implement the
   handler in `handlers/<name>.ts`. Use `replier.reply(...)` for the response.
4. **Gateway**: add a bridge file under `server/gateway/src/bridge/`. Subscribe
   to the relevant `mp.events`. Use `rpc.call(...)` for RPC, `producer.publish(...)`
   for fire-and-forget. Echo the reply back with `player.call('redage:<x>:reply', [...])`.
5. **Client**: add `src/frontend/client/src/modules/<domain>/index.ts`. Bridge
   `redage.<domain>.<x>` (dots) → `redage:<domain>:<x>` (colons), and relay the
   reply back to CEF via `emitToCef`. Add the import to
   `src/frontend/client/index.ts`.
6. **CEF**: add a contract Zod schema in `src/frontend/cef/src/api/contracts/`,
   and a composable in `src/frontend/cef/src/composables/use<Domain>.ts` that
   wires `executeClient` + `addListernEvent`.

---

## Reference: files that matter

| Concern                             | Path                                                            |
|-------------------------------------|-----------------------------------------------------------------|
| Vue composables (auth/char/etc.)    | `src/frontend/cef/src/composables/`                             |
| CEF → client trigger / RPC helpers  | `src/frontend/cef/src/api/rage.ts`                              |
| CEF inbound event dispatch          | `src/frontend/cef/src/api/functions.ts` (`listernEvent`)        |
| CEF Zod contracts                   | `src/frontend/cef/src/api/contracts/`                           |
| Client browser owner                | `src/frontend/client/src/modules/cef/index.ts`                  |
| Client bridges                      | `src/frontend/client/src/modules/{auth,character,customization}/` |
| Gateway entrypoint                  | `src/backend/server/gateway/src/index.ts`                       |
| Gateway bridges                     | `src/backend/server/gateway/src/bridge/`                        |
| Gateway session registry            | `src/backend/server/gateway/src/session.ts`                     |
| Envelope shape                      | `src/backend/libs/contracts/src/envelope/envelope.ts`           |
| Topic names                         | `src/backend/libs/contracts/src/topics.ts`                      |
| Kafka producer / consumer / RPC     | `src/backend/libs/kafka/src/{producer,consumer,rpc,replier}.ts` |
| Wire-format validators              | `src/backend/libs/validators/src/`                              |
| Auth service                        | `src/backend/services/auth/src/`                                |
| Player service                      | `src/backend/services/player/src/`                              |
| Shared Prisma client                | `src/backend/services/shared/`                                  |
| Architectural decisions             | `src/backend/server/ARCHITECTURE.md`                            |
| Operational README                  | `src/backend/server/README.md`                                  |