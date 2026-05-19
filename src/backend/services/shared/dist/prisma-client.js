import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/index.js';
let _instance = null;
/**
 * Singleton PrismaClient per Node process.
 *
 * Prisma 7's `prisma-client-js` generator emits the new "client" engine
 * which requires a runtime driver adapter. We use `@prisma/adapter-pg`
 * (node-postgres) and feed it `DATABASE_URL` directly — no binary engine
 * shipped in the image, no separate query engine to download.
 */
export function getPrisma() {
    if (_instance)
        return _instance;
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL not set — required by @prisma/adapter-pg');
    }
    const adapter = new PrismaPg({ connectionString });
    _instance = new PrismaClient({
        adapter,
        log: process.env.PRISMA_LOG === '1' ? ['warn', 'error'] : ['error'],
    });
    return _instance;
}
export async function disconnectPrisma() {
    if (_instance) {
        await _instance.$disconnect();
        _instance = null;
    }
}
export { PrismaClient };
//# sourceMappingURL=prisma-client.js.map