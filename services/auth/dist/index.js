import { ServiceRuntime, optionalEnv } from '@redage/service-runtime';
import { createKafka, brokersFromEnv, EventConsumer, Replier } from '@redage/kafka';
import { Topics, LoginCommand, RegisterCommand } from '@redage/contracts';
import { getPrisma, disconnectPrisma } from '@redage/shared';
import { AccountRepository } from './repository/account-repo.js';
import { handleLogin } from './handlers/login.js';
import { handleRegister } from './handlers/register.js';
async function main() {
    const runtime = new ServiceRuntime({ name: 'auth-service' });
    const { logger } = runtime;
    const kafka = createKafka({
        clientId: optionalEnv('KAFKA_CLIENT_ID', 'redage-auth'),
        brokers: brokersFromEnv(),
    });
    const prisma = getPrisma();
    const repo = new AccountRepository(prisma);
    const replier = new Replier(kafka, 'auth-service', logger);
    await replier.start();
    const consumer = new EventConsumer(kafka, { groupId: optionalEnv('AUTH_CONSUMER_GROUP', 'redage-auth-service') }, logger);
    consumer.on(Topics.AuthCommands, 'auth.login', LoginCommand, async (cmd, envelope) => {
        await handleLogin(cmd, envelope, { repo, replier, logger });
    });
    consumer.on(Topics.AuthCommands, 'auth.register', RegisterCommand, async (cmd, envelope) => {
        await handleRegister(cmd, envelope, { repo, replier, logger });
    });
    await consumer.start();
    runtime.onShutdown(() => consumer.stop());
    runtime.onShutdown(() => replier.stop());
    runtime.onShutdown(() => disconnectPrisma());
    await runtime.start({ healthPort: Number(optionalEnv('HEALTH_PORT', '0')) });
    runtime.markHealthy();
    runtime.markReady();
    logger.info('auth-service online');
}
main().catch((err) => {
    console.error('auth-service boot failed', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map