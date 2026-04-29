using Bridge.Contracts;
using Grpc.Net.Client;

namespace GameServer.Bridge;

// Thin facade over the generated gRPC client. Add methods here as you need
// more natives exposed from the Bridge.
public sealed class BridgeClient
{
    private readonly BridgeService.BridgeServiceClient _rpc;

    public BridgeClient(GrpcChannel channel) =>
        _rpc = new BridgeService.BridgeServiceClient(channel);

    // Expose the raw client so BridgeEventDispatcher can call SubscribeEvents.
    internal BridgeService.BridgeServiceClient Raw => _rpc;

    public async Task TriggerClientEvent(uint playerId, string eventName, params string[] args)
    {
        var req = new TriggerClientEventRequest { PlayerId = playerId, EventName = eventName };
        req.Args.AddRange(args);
        await _rpc.TriggerClientEventAsync(req);
    }

    public async Task SetPlayerPosition(uint playerId, float x, float y, float z) =>
        await _rpc.SetPlayerPositionAsync(
            new SetPositionRequest { PlayerId = playerId, X = x, Y = y, Z = z });

    public async Task SetPlayerDimension(uint playerId, uint dimension) =>
        await _rpc.SetPlayerDimensionAsync(
            new SetDimensionRequest { PlayerId = playerId, Dimension = dimension });

    public async Task KickPlayer(uint playerId, string reason) =>
        await _rpc.KickPlayerAsync(new KickPlayerRequest { PlayerId = playerId, Reason = reason });

    public async Task SendNotification(uint playerId, string message) =>
        await _rpc.SendNotificationAsync(
            new SendNotificationRequest { PlayerId = playerId, Message = message });

    public async Task<CreateVehicleResponse> CreateVehicle(
        uint model, float x, float y, float z,
        float heading = 0f, uint dimension = 0, string numberPlate = "") =>
        await _rpc.CreateVehicleAsync(new CreateVehicleRequest
        {
            Model = model, X = x, Y = y, Z = z,
            Heading = heading, Dimension = dimension, NumberPlate = numberPlate
        });

    public async Task DestroyVehicle(uint vehicleId) =>
        await _rpc.DestroyVehicleAsync(new DestroyVehicleRequest { VehicleId = vehicleId });

    public async Task BroadcastMessage(string message, string color = "") =>
        await _rpc.BroadcastMessageAsync(
            new BroadcastMessageRequest { Message = message, Color = color });
}
