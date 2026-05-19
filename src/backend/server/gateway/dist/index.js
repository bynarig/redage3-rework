import { ServiceRuntime } from '@redage/service-runtime';
import { createKafka, EventProducer, RpcClient, ensureTopics } from '@redage/kafka';
import { Topics } from '@redage/contracts';
import { config } from './config.js';
import { SessionRegistry } from './session.js';
import { registerPlayerEventBridge } from './bridge/player-events.js';
import { registerAuthBridge } from './bridge/auth-bridge.js';
import { registerCharacterBridge } from './bridge/character-bridge.js';
/**
 * Gateway entrypoint. Runs INSIDE the RAGE:MP node process (as a resource).
 *
 * Responsibilities (and only these):
 *  - Connect to Kafka.
 *  - Translate RAGE:MP events -> Kafka events.
 *  - Translate RAGE:MP RPC calls (from client/CEF) -> Kafka commands via RPC.
 *  - Apply replies back to the RAGE:MP Player object.
 *
 * It owns NO game logic, NO database access, NO business rules.
 */
async function main() {
    const runtime = new ServiceRuntime({ name: config.serviceName });
    const { logger } = runtime;
    const kafka = createKafka({ clientId: config.kafka.clientId, brokers: config.kafka.brokers });
    // Best-effort topic creation. In prod, topics should be provisioned via IaC.
    await ensureTopics(kafka, [
        { topic: Topics.PlayerEvents, numPartitions: 12, replicationFactor: 1 },
        { topic: Topics.VehicleEvents, numPartitions: 12, replicationFactor: 1 },
        { topic: Topics.InventoryEvents, numPartitions: 12, replicationFactor: 1 },
        { topic: Topics.EconomyEvents, numPartitions: 6, replicationFactor: 1 },
        { topic: Topics.WorldEvents, numPartitions: 6, replicationFactor: 1 },
        { topic: Topics.AuthCommands, numPartitions: 6, replicationFactor: 1 },
        { topic: Topics.PlayerCommands, numPartitions: 12, replicationFactor: 1 },
        { topic: Topics.InventoryCommands, numPartitions: 12, replicationFactor: 1 },
        { topic: Topics.EconomyCommands, numPartitions: 6, replicationFactor: 1 },
        { topic: Topics.GatewayReplies, numPartitions: 6, replicationFactor: 1 },
    ], logger);
    const producer = new EventProducer(kafka, config.serviceName, logger);
    await producer.connect();
    const rpc = new RpcClient(kafka, {
        source: config.serviceName,
        replyTopic: config.replyTopic,
        consumerGroupId: config.consumerGroup,
        defaultTimeoutMs: 10_000,
    }, logger);
    await rpc.start();
    const sessions = new SessionRegistry();
    // Only wire mp.events handlers if running inside RAGE:MP. When developing
    // standalone (tsx dev), `mp` is undefined — we still want the kafka layer
    // to come up so smoke-tests / topic creation work.
    if (typeof globalThis.mp !== 'undefined') {
        registerPlayerEventBridge({
            producer,
            sessions,
            logger,
            positionThrottleMs: config.positionThrottleMs,
        });
        registerAuthBridge({ rpc, sessions, logger });
        const character = registerCharacterBridge({ rpc, producer, sessions, logger });
        runtime.onShutdown(character.stop);
    }
    else {
        logger.warn('mp global not detected — running in standalone mode (no RAGE:MP bridging)');
    }
    runtime.onShutdown(async () => {
        await producer.disconnect();
    });
    await runtime.start({ healthPort: config.healthPort });
    runtime.markHealthy();
    runtime.markReady();
    logger.info({ brokers: config.kafka.brokers }, 'gateway online');
}
main().catch((err) => {
    // We have no logger yet if this fires very early.
    console.error('gateway boot failed', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map