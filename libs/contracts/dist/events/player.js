import { z } from 'zod';
export const PlayerConnectedEvent = z.object({
    type: z.literal('player.connected'),
    payload: z.object({
        rageId: z.number().int().nonnegative(),
        socialClub: z.string(),
        name: z.string(),
        ip: z.string(),
        hwid: z.string(),
        serial: z.string().optional(),
    }),
});
export const PlayerDisconnectedEvent = z.object({
    type: z.literal('player.disconnected'),
    payload: z.object({
        rageId: z.number().int().nonnegative(),
        accountId: z.number().int().positive().nullable(),
        characterId: z.number().int().positive().nullable(),
        reason: z.enum(['quit', 'timeout', 'kicked']),
        sessionSeconds: z.number().int().nonnegative(),
    }),
});
export const PlayerAuthenticatedEvent = z.object({
    type: z.literal('player.authenticated'),
    payload: z.object({
        rageId: z.number().int().nonnegative(),
        accountId: z.number().int().positive(),
    }),
});
export const PlayerCharacterSelectedEvent = z.object({
    type: z.literal('player.character_selected'),
    payload: z.object({
        rageId: z.number().int().nonnegative(),
        accountId: z.number().int().positive(),
        characterId: z.number().int().positive(),
    }),
});
export const PlayerPositionEvent = z.object({
    type: z.literal('player.position'),
    payload: z.object({
        rageId: z.number().int().nonnegative(),
        characterId: z.number().int().positive(),
        x: z.number(),
        y: z.number(),
        z: z.number(),
        heading: z.number(),
        dimension: z.number().int().nonnegative(),
    }),
});
export const PlayerDeathEvent = z.object({
    type: z.literal('player.death'),
    payload: z.object({
        rageId: z.number().int().nonnegative(),
        characterId: z.number().int().positive(),
        killerRageId: z.number().int().nonnegative().nullable(),
        weaponHash: z.number().int(),
    }),
});
export const PlayerEvent = z.discriminatedUnion('type', [
    PlayerConnectedEvent,
    PlayerDisconnectedEvent,
    PlayerAuthenticatedEvent,
    PlayerCharacterSelectedEvent,
    PlayerPositionEvent,
    PlayerDeathEvent,
]);
//# sourceMappingURL=player.js.map