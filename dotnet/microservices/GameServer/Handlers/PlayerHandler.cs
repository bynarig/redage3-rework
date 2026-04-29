using Bridge.Contracts;
using GameServer.Bridge;
using Microsoft.Extensions.Logging;

namespace GameServer.Handlers;

public interface IPlayerHandler
{
    Task OnConnected(PlayerConnectedEvent evt, CancellationToken ct);
    Task OnDisconnected(PlayerDisconnectedEvent evt, CancellationToken ct);
    Task OnSpawned(PlayerSpawnedEvent evt, CancellationToken ct);
    Task OnDeath(PlayerDeathEvent evt, CancellationToken ct);
    Task OnChat(PlayerChatEvent evt, CancellationToken ct);
    Task OnCommand(PlayerCommandEvent evt, CancellationToken ct);
    Task OnServerEvent(ServerEventData evt, CancellationToken ct);
}

public class PlayerHandler : IPlayerHandler
{
    private readonly BridgeClient _bridge;
    private readonly ILogger<PlayerHandler> _log;

    public PlayerHandler(BridgeClient bridge, ILogger<PlayerHandler> log)
    {
        _bridge = bridge;
        _log    = log;
    }

    public async Task OnConnected(PlayerConnectedEvent evt, CancellationToken ct)
    {
        _log.LogInformation("Player connected: {Name} (id={Id})", evt.Player.Name, evt.Player.Id);
        await _bridge.SendNotification(evt.Player.Id, "Welcome to the server!");
    }

    public Task OnDisconnected(PlayerDisconnectedEvent evt, CancellationToken ct)
    {
        _log.LogInformation("Player disconnected: id={Id}, reason={Reason}", evt.PlayerId, evt.Reason);
        return Task.CompletedTask;
    }

    public Task OnSpawned(PlayerSpawnedEvent evt, CancellationToken ct)
    {
        _log.LogInformation("Player spawned: id={Id}", evt.PlayerId);
        return Task.CompletedTask;
    }

    public Task OnDeath(PlayerDeathEvent evt, CancellationToken ct)
    {
        _log.LogInformation("Player died: id={Id}, killer={KillerId}, weapon={Weapon}",
            evt.PlayerId, evt.KillerId, evt.Weapon);
        return Task.CompletedTask;
    }

    public Task OnChat(PlayerChatEvent evt, CancellationToken ct)
    {
        _log.LogInformation("[Chat] id={Id}: {Message}", evt.PlayerId, evt.Message);
        return Task.CompletedTask;
    }

    public Task OnCommand(PlayerCommandEvent evt, CancellationToken ct)
    {
        _log.LogInformation("[Command] id={Id}: /{Cmd} {Args}", evt.PlayerId, evt.Command, evt.ArgsRaw);
        return Task.CompletedTask;
    }

    public Task OnServerEvent(ServerEventData evt, CancellationToken ct)
    {
        _log.LogDebug("[ServerEvent] {Event} from id={Id}", evt.EventName, evt.PlayerId);
        return Task.CompletedTask;
    }
}
