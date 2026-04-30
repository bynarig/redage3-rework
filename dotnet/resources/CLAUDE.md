# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projects

The solution (`NeptuneEvo.sln`) has three projects:

- **NeptuneEvo** — main RAGE:MP server resource; entry point is `NeptuneEvo/Main.cs` (`class Main : Script`)
- **NeptuneEvoSDK** — shared SDK utilities (logging, timers, triggers, settings, MySQL helpers); namespace `Redage.SDK`
- **Localization** — translation strings; all keys are in `Localization/DataName.cs` (enum), text retrieved via `LangFunc.GetText(LangType.Ru, DataName.SomeKey, args)`

## Build

```bash
# Build entire solution
dotnet build NeptuneEvo.sln

# Build a single project
dotnet build NeptuneEvo/NeptuneEvo.csproj

# Release build
dotnet build NeptuneEvo.sln -c Release
```

All projects target **netcoreapp3.1** / C# 8.0. There are no test projects.

After building, RAGE:MP loads `NeptuneEvo/bin/Debug/netcoreapp3.1/NeptuneEvo.dll` as described in `NeptuneEvo/meta.xml`.

## Architecture

### Repository + Events pattern

Every module follows the same split:

- **`Repository.cs`** — static class with extension methods on `ExtPlayer` (or other handles); holds the business logic and DB queries.
- **`Events.cs`** — static class that registers RAGE:MP server events (`[ServerEvent]`) and client events (`[RemoteEvent]`), then delegates to the Repository.
- **`Models/`** — plain data classes serialized to/from JSON or stored in player session.

Repository methods always guard against null state before acting:

```csharp
public static bool IsAccountData(this ExtPlayer player) =>
    player is not null && player.AccountData != null;
```

### Entity handles (`Handles/`)

`ExtPlayer : Player` wraps the RAGE:MP `Player` with all game state:
- `player.AccountData` — login/email/premium currency
- `player.SessionData` — per-session ephemeral state (job, taxi, dice, admin flags, …)
- `player.CharacterData` — persistent character stats (health, money, EXP, …)
- `player.Customization` — appearance/clothes

Use these instead of the raw `Player` type throughout the codebase. Similar wrappers exist for `ExtVehicle`, `ExtColShape`, etc.

### Triggering client events

Always use `Trigger.ClientEvent(player, "eventName", args)` from `Redage.SDK`. It handles thread safety automatically — if the call comes from a background thread it wraps in `NAPI.Task.Run()`.

```csharp
Trigger.ClientEvent(player, "notify", (int)NotifyType.Success, "Done");
```

Never call `NAPI.ClientEvent.TriggerClientEvent()` directly.

### Database (LINQ2DB + MySQL)

Database contexts are T4-generated:
- `ConfigBD` (`Database/Config/Config.generated.cs`) → database `ra3_mainconfig`
- `ServerBD` (`Database/Server/ServerStruct.generated.cs`) → database `ra3_main`

Connection strings come from `settings/dbSettings.json` (loaded via `Settings.ReadAsync`). `ConnectionInfo.cs` implements `IConnectionStringSettings` for LINQ2DB.

Typical query pattern:

```csharp
using var db = new ServerBD("ra3_main");
var row = db.Players.FirstOrDefault(p => p.Uuid == uuid);
```

For raw queries or stored procedures, `NeptuneEvoSDK/MySQL.cs` exposes a legacy `MySQL` helper — prefer LINQ2DB for new code.

### Settings / configuration

All runtime configuration lives in JSON files under `settings/` (relative to the server working directory). Read and write via `Redage.SDK.Settings`:

```csharp
var cfg = Settings.ReadAsync("serverSettings", new ServerSettings());
Settings.WriteAsync("serverSettings", cfg);
```

Global settings instances are singletons on `Main` (e.g., `Main.MoneySettings`, `Main.PricesSettings`).

### Timers

Use `Redage.SDK.Timers` for repeating background work — it runs a dedicated polling thread and stores timers in a `ConcurrentDictionary<string, nTimer>`. Do not use `System.Threading.Timer` directly.

### Logging

```csharp
private static readonly nLog Log = new nLog("Module.ClassName");
Log.Info("message");
Log.Warn("message");
Log.Error("message");
```

### Global player maps (on `Main`)

| Dictionary | Key → Value |
|---|---|
| `PlayerIdToEntity` | RAGE player ID → `ExtPlayer` |
| `PlayerUUIDToPlayerId` | Character UUID → player ID |
| `PlayerNames` | Character UUID → display name |
| `PlayerBankAccs` | Character name → bank account number |

Use these instead of iterating `NAPI.Pools.GetAllPlayers()`.

## Key files

| File | Purpose |
|---|---|
| `NeptuneEvo/Main.cs` | Startup, global state, settings loading |
| `NeptuneEvo/Core/Commands.cs` | All `/command` handlers (monolithic, 373 KB) |
| `NeptuneEvo/Handles/ExtPlayer.cs` | Player entity wrapper |
| `NeptuneEvo/Players/Models/SessionData.cs` | Per-session runtime state |
| `NeptuneEvo/Accounts/Models/AccountData.cs` | Persisted account data |
| `NeptuneEvo/Character/Models/CharacterData.cs` | Persisted character data |
| `NeptuneEvoSDK/Trigger.cs` | Thread-safe client event helper |
| `NeptuneEvoSDK/Timers.cs` | Background timer management |
| `NeptuneEvoSDK/Settings.cs` | JSON config I/O |
| `Localization/DataName.cs` | All localisation string keys |

## Known issues / gotchas

- `Newtonsoft.Json 12.0.3` has a known high-severity vulnerability (NU1903). Upgrading requires testing all JSON serialization paths.
- `Core/Commands.cs` is a single 373 KB file — search within it rather than trying to read it top-to-bottom.
- T4 templates (`*.tt`) generate the `*.generated.cs` database context files. Re-run T4 generation in Rider/Visual Studio when the MySQL schema changes; do not hand-edit the generated files.
- RAGE:MP enforces that most NAPI calls must happen on the "Main" thread — `Trigger.ClientEvent` handles this, but direct NAPI calls from background threads will crash silently.