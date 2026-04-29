using Bridge.Contracts;
using GameServer.Handlers;
using Grpc.Core;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace GameServer.Bridge;

// Runs as a hosted background service. Connects to the Bridge gRPC stream and
// dispatches incoming RAGE:MP events to the appropriate handler.
public sealed class BridgeEventDispatcher : BackgroundService
{
    private readonly BridgeClient _bridge;
    private readonly IPlayerHandler _players;
    private readonly ILogger<BridgeEventDispatcher> _log;

    public BridgeEventDispatcher(
        BridgeClient bridge,
        IPlayerHandler players,
        ILogger<BridgeEventDispatcher> log)
    {
        _bridge  = bridge;
        _players = players;
        _log     = log;
    }

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                await Subscribe(ct);
            }
            catch (RpcException ex) when (ex.StatusCode == StatusCode.Unavailable)
            {
                _log.LogWarning("Bridge unavailable — retrying in 3 s...");
                await Task.Delay(3_000, ct);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Event stream error — retrying in 3 s...");
                await Task.Delay(3_000, ct);
            }
        }
    }

    private async Task Subscribe(CancellationToken ct)
    {
        using var call = _bridge.Raw.SubscribeEvents(
            new SubscribeRequest { SubscriberId = "GameServer" },
            cancellationToken: ct);

        _log.LogInformation("Connected to Bridge — listening for events");

        await foreach (var evt in call.ResponseStream.ReadAllAsync(ct))
            await Dispatch(evt, ct);
    }

    private Task Dispatch(GameEvent evt, CancellationToken ct) =>
        evt.PayloadCase switch
        {
            GameEvent.PayloadOneofCase.PlayerConnected    => _players.OnConnected(evt.PlayerConnected, ct),
            GameEvent.PayloadOneofCase.PlayerDisconnected => _players.OnDisconnected(evt.PlayerDisconnected, ct),
            GameEvent.PayloadOneofCase.PlayerSpawned      => _players.OnSpawned(evt.PlayerSpawned, ct),
            GameEvent.PayloadOneofCase.PlayerDeath        => _players.OnDeath(evt.PlayerDeath, ct),
            GameEvent.PayloadOneofCase.PlayerChat         => _players.OnChat(evt.PlayerChat, ct),
            GameEvent.PayloadOneofCase.PlayerCommand      => _players.OnCommand(evt.PlayerCommand, ct),
            GameEvent.PayloadOneofCase.ServerEvent        => _players.OnServerEvent(evt.ServerEvent, ct),
            _                                             => Task.CompletedTask
        };
}
