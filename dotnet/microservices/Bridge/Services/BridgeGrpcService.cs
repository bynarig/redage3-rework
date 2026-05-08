using Bridge.Contracts;
using GTANetworkAPI;
using Grpc.Core;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace RageBridge.Services
{
    public sealed class BridgeGrpcService : BridgeService.BridgeServiceBase
    {
        private readonly EventBus _eventBus;

        public BridgeGrpcService(EventBus eventBus) => _eventBus = eventBus;

        // ── Event stream ──────────────────────────────────────────────────────

        public override async Task SubscribeEvents(
            SubscribeRequest request,
            IServerStreamWriter<GameEvent> stream,
            ServerCallContext context)
        {
            Console.WriteLine($"[Bridge] GameServer subscribed (id={request.SubscriberId})");

            await foreach (var evt in _eventBus.ReadAllAsync(context.CancellationToken))
                await stream.WriteAsync(evt);
        }

        // ── Natives ───────────────────────────────────────────────────────────

        public override Task<BaseResponse> TriggerClientEvent(
            TriggerClientEventRequest request, ServerCallContext context)
        {
            NAPI.Task.Run(() =>
            {
                var player = GetPlayer(request.PlayerId);
                if (player == null) return;
                NAPI.ClientEvent.TriggerClientEvent(player, request.EventName,
                    request.Args.Cast<object>().ToArray());
            });
            return Ok();
        }

        public override Task<BaseResponse> SetPlayerPosition(
            SetPositionRequest request, ServerCallContext context)
        {
            NAPI.Task.Run(() =>
            {
                var player = GetPlayer(request.PlayerId);
                if (player == null) return;
                player.Position = new Vector3(request.X, request.Y, request.Z);
            });
            return Ok();
        }

        public override Task<BaseResponse> SetPlayerDimension(
            SetDimensionRequest request, ServerCallContext context)
        {
            NAPI.Task.Run(() =>
            {
                var player = GetPlayer(request.PlayerId);
                if (player == null) return;
                player.Dimension = request.Dimension;
            });
            return Ok();
        }

        public override Task<BaseResponse> KickPlayer(
            KickPlayerRequest request, ServerCallContext context)
        {
            NAPI.Task.Run(() => GetPlayer(request.PlayerId)?.Kick(request.Reason));
            return Ok();
        }

        public override Task<BaseResponse> SendNotification(
            SendNotificationRequest request, ServerCallContext context)
        {
            NAPI.Task.Run(() =>
            {
                var player = GetPlayer(request.PlayerId);
                if (player == null) return;
                NAPI.Notification.SendNotificationToPlayer(player, request.Message);
            });
            return Ok();
        }

        public override Task<CreateVehicleResponse> CreateVehicle(
            CreateVehicleRequest request, ServerCallContext context)
        {
            var tcs = new TaskCompletionSource<CreateVehicleResponse>();

            NAPI.Task.Run(() =>
            {
                try
                {
                    var vehicle = NAPI.Vehicle.CreateVehicle(
                        request.Model,
                        new Vector3(request.X, request.Y, request.Z),
                        request.Heading,
                        0, 0,
                        request.NumberPlate,
                        255, true, true,
                        request.Dimension);

                    tcs.SetResult(new CreateVehicleResponse { Success = true, VehicleId = vehicle.Id });
                }
                catch (Exception ex)
                {
                    tcs.SetResult(new CreateVehicleResponse { Success = false, Error = ex.Message });
                }
            });

            return tcs.Task;
        }

        public override Task<BaseResponse> DestroyVehicle(
            DestroyVehicleRequest request, ServerCallContext context)
        {
            NAPI.Task.Run(() =>
            {
                var vehicle = NAPI.Pools.GetAllVehicles().FirstOrDefault(v => v.Id == (ushort)request.VehicleId);
                vehicle?.Delete();
            });
            return Ok();
        }

        public override Task<BaseResponse> BroadcastMessage(
            BroadcastMessageRequest request, ServerCallContext context)
        {
            NAPI.Task.Run(() =>
            {
                var msg = string.IsNullOrEmpty(request.Color)
                    ? request.Message
                    : $"~{request.Color}~{request.Message}";
                NAPI.Chat.SendChatMessageToAll(msg);
            });
            return Ok();
        }

        // ── Helpers ───────────────────────────────────────────────────────────

        private static Player? GetPlayer(uint id) =>
            NAPI.Pools.GetAllPlayers().FirstOrDefault(p => p.Id == id);

        private static Task<BaseResponse> Ok() =>
            Task.FromResult(new BaseResponse { Success = true });
    }
}
