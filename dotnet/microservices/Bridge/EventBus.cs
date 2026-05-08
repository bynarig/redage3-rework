using Bridge.Contracts;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Channels;

namespace RageBridge
{
    // Single-subscriber design. For fan-out to multiple consumers, swap Channel
    // for a list of channels and broadcast to each on Publish.
    public sealed class EventBus
    {
        private readonly Channel<GameEvent> _channel =
            Channel.CreateUnbounded<GameEvent>(new UnboundedChannelOptions
            {
                SingleReader = true,
                SingleWriter = false,
                AllowSynchronousContinuations = false
            });

        public void Publish(GameEvent gameEvent) =>
            _channel.Writer.TryWrite(gameEvent);

        public IAsyncEnumerable<GameEvent> ReadAllAsync(CancellationToken ct = default) =>
            _channel.Reader.ReadAllAsync(ct);
    }
}
