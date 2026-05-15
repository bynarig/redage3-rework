import { ServiceRuntime, optionalEnv } from '@redage/service-runtime';
import { createKafka, brokersFromEnv, EventConsumer, Replier } from '@redage/kafka';
import { Topics, LoadCharacterCommand, SaveCharacterCommand } from '@redage/contracts';
import { getPrisma, disconnectPrisma } from '@redage/shared';
import { CharacterRepository } from './repository/character-repo.js';
import { handleLoadCharacter } from './handlers/load-character.js';
import { handleSaveCharacter } from './handlers/save-character.js';
async function main() {
    const runtime = new ServiceRuntime({ name: 'player-service' });
    const { logger } = runtime;
    const kafka = createKafka({
        clientId: optionalEnv('KAFKA_CLIENT_ID', 'redage-player'),
        brokers: brokersFromEnv(),
    });
    const prisma = getPrisma();
    const repo = new CharacterRepository(prisma);
    const replier = new Replier(kafka, 'player-service', logger);
    await replier.start();
    const consumer = new EventConsumer(kafka, { groupId: optionalEnv('PLAYER_CONSUMER_GROUP', 'redage-player-service') }, logger);
    consumer.on(Topics.PlayerCommands, 'player.load_character', LoadCharacterCommand, async (cmd, env) => {
        await handleLoadCharacter(cmd, env, { repo, replier, logger });
    });
    consumer.on(Topics.PlayerCommands, 'player.save_character', SaveCharacterCommand, async (cmd, env) => {
        await handleSaveCharacter(cmd, env, { repo, logger });
    });
    await consumer.start();
    runtime.onShutdown(() => consumer.stop());
    runtime.onShutdown(() => replier.stop());
    runtime.onShutdown(() => disconnectPrisma());
    await runtime.start({ healthPort: Number(optionalEnv('HEALTH_PORT', '0')) });
    runtime.markHealthy();
    runtime.markReady();
    logger.info('player-service online');
}
main().catch((err) => {
    console.error('player-service boot failed', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map