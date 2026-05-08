using GameServer.Bridge;
using GameServer.Handlers;
using Grpc.Net.Client;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((ctx, services) =>
    {
        var address = ctx.Configuration["Bridge:Address"] ?? "http://127.0.0.1:5010";

        services.AddSingleton(_ => new BridgeClient(
            GrpcChannel.ForAddress(address, new GrpcChannelOptions
            {
                // gRPC over plain HTTP/2 (no TLS) to talk with Grpc.Core server
                Credentials = Grpc.Core.ChannelCredentials.Insecure
            })));

        services.AddSingleton<IPlayerHandler, PlayerHandler>();
        services.AddHostedService<BridgeEventDispatcher>();
    })
    .Build();

await host.RunAsync();
