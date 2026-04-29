using Bridge.Contracts;
using GTANetworkAPI;
using Grpc.Core;
using RageBridge.Services;
using System;

namespace RageBridge
{
    public class Main : Script
    {
        public static readonly EventBus EventBus = new EventBus();

        private Grpc.Core.Server? _grpcServer;

        public Main()
        {
            StartGrpcServer();
        }

        private void StartGrpcServer()
        {
            try
            {
                _grpcServer = new Grpc.Core.Server
                {
                    Services = { BridgeService.BindService(new BridgeGrpcService(EventBus)) },
                    Ports    = { new ServerPort("127.0.0.1", 5010, ServerCredentials.Insecure) }
                };
                _grpcServer.Start();
                Console.WriteLine("[Bridge] gRPC server listening on 127.0.0.1:5010");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Bridge] Failed to start gRPC server: {ex.Message}");
            }
        }

        [ServerEvent(Event.ResourceStop)]
        public async void OnResourceStop()
        {
            if (_grpcServer != null)
                await _grpcServer.ShutdownAsync();
        }
    }
}
