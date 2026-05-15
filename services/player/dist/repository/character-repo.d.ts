import type { PrismaClient } from '@redage/shared';
import type { CharacterDto } from '@redage/contracts';
/**
 * Reads/writes a `characters` row using the generated Prisma client.
 *
 * The legacy schema stores position as a serialized string in `pos`, not
 * as separate columns — see `@redage/shared/position` for parsing.
 * Dimension is also packed into `pos`, so this is the only place that
 * deals with the legacy on-wire format.
 */
export declare class CharacterRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    load(characterId: number): Promise<CharacterDto | null>;
    save(input: {
        characterId: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
    }): Promise<void>;
}
//# sourceMappingURL=character-repo.d.ts.map