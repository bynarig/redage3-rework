import { z } from 'zod';
export const LoadCharacterCommand = z.object({
    type: z.literal('player.load_character'),
    payload: z.object({
        rageId: z.number().int().nonnegative(),
        accountId: z.number().int().positive(),
        characterId: z.number().int().positive(),
    }),
});
export const SaveCharacterCommand = z.object({
    type: z.literal('player.save_character'),
    payload: z.object({
        characterId: z.number().int().positive(),
        position: z.object({ x: z.number(), y: z.number(), z: z.number(), heading: z.number() }),
        health: z.number().int().min(0).max(100),
        armor: z.number().int().min(0).max(100),
        dimension: z.number().int().nonnegative(),
    }),
});
export const PlayerCommand = z.discriminatedUnion('type', [LoadCharacterCommand, SaveCharacterCommand]);
export const CharacterDto = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    cash: z.number().int(),
    bank: z.number().int(),
    position: z.object({ x: z.number(), y: z.number(), z: z.number(), heading: z.number() }),
    health: z.number().int(),
    armor: z.number().int(),
    dimension: z.number().int().nonnegative(),
});
export const PlayerReply = z.object({
    ok: z.boolean(),
    error: z.string().optional(),
    character: CharacterDto.optional(),
});
//# sourceMappingURL=player.js.map