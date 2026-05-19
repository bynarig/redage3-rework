import type { PrismaClient } from '@redage/shared';
import type { CharacterDto } from '@redage/contracts';
import { type CreateCharacterWire, type SaveCharacterWire, type SaveCustomizationWire } from '@redage/validators';
/**
 * Reads/writes a `characters` row + its 1:1 `customization` row.
 *
 * Optimization notes:
 *  - `load()` uses one raw SELECT because the generated Prisma character model
 *    is currently behind the live reworked database column names.
 *  - `save()` only writes the position/health/armor columns we know changed —
 *    no SELECT-then-UPDATE round trip.
 *  - `create()` runs in a transaction so a partial insert leaves nothing behind.
 */
export declare class CharacterRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    load(characterId: number): Promise<CharacterDto | null>;
    save(input: SaveCharacterWire): Promise<void>;
    saveCustomization(input: SaveCustomizationWire): Promise<void>;
    /**
     * Create a fresh character, its 1:1 customization row, and link it to the
     * account via account_characters + the legacy `accounts.characters` varchar
     * so the existing login flow surfaces it in the character picker.
     */
    create(input: CreateCharacterWire): Promise<{
        characterId: number;
    }>;
}
//# sourceMappingURL=character-repo.d.ts.map