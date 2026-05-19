import { PrismaClient } from '../prisma/index.js';
/**
 * Singleton PrismaClient per Node process.
 *
 * Prisma 7's `prisma-client-js` generator emits the new "client" engine
 * which requires a runtime driver adapter. We use `@prisma/adapter-pg`
 * (node-postgres) and feed it `DATABASE_URL` directly — no binary engine
 * shipped in the image, no separate query engine to download.
 */
export declare function getPrisma(): PrismaClient;
export declare function disconnectPrisma(): Promise<void>;
export { PrismaClient };
export type * from '../prisma/index.js';
//# sourceMappingURL=prisma-client.d.ts.map