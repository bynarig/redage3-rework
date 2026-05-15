import { Topics } from '@redage/contracts';
/**
 * Character selection / spawn flow:
 *  1. UI calls `redage:character:select` with characterId.
 *  2. Gateway issues `player.load_character` to player-service via RPC.
 *  3. On success, applies position/health/armor to the actual RAGE:MP player
 *     and emits a `player.character_selected` event for downstream services.
 *
 * Periodic auto-save: every N seconds we emit `player.save_character`
 * (fire-and-forget) so persistence is decoupled from gameplay.
 */
export function registerCharacterBridge(deps) {
    const { rpc, producer, sessions, logger } = deps;
    const autoSaveIntervalMs = deps.autoSaveIntervalMs ?? 60_000;
    mp.events.add('redage:character:select', (...args) => {
        const player = args[0];
        const characterId = Number(args[1] ?? 0);
        if (!characterId)
            return;
        const session = sessions.get(player.id);
        if (!session?.accountId) {
            player.call('redage:character:reply', [{ ok: false, error: 'not authenticated' }]);
            return;
        }
        void (async () => {
            try {
                const reply = await rpc.call({
                    topic: Topics.PlayerCommands,
                    key: String(player.id),
                    type: 'player.load_character',
                    payload: { rageId: player.id, accountId: session.accountId, characterId },
                });
                if (!reply.payload.ok || !reply.payload.character) {
                    player.call('redage:character:reply', [reply.payload]);
                    return;
                }
                const c = reply.payload.character;
                // Apply to live game state.
                player.position = { x: c.position.x, y: c.position.y, z: c.position.z };
                player.heading = c.position.heading;
                player.health = c.health;
                player.armour = c.armor;
                player.dimension = c.dimension;
                session.characterId = c.id;
                await producer.publish({
                    topic: Topics.PlayerEvents,
                    key: String(player.id),
                    type: 'player.character_selected',
                    payload: { rageId: player.id, accountId: session.accountId, characterId: c.id },
                });
                player.call('redage:character:reply', [reply.payload]);
            }
            catch (err) {
                logger.error({ err, rageId: player.id }, 'load_character rpc failed');
                player.call('redage:character:reply', [{ ok: false, error: 'service unavailable' }]);
            }
        })();
    });
    // Periodic save tick. Pull live state from RAGE:MP for any logged-in player.
    const timer = setInterval(() => {
        mp.players.forEach((p) => {
            const s = sessions.get(p.id);
            if (!s?.characterId)
                return;
            void producer
                .publish({
                topic: Topics.PlayerCommands,
                key: String(p.id),
                type: 'player.save_character',
                payload: {
                    characterId: s.characterId,
                    position: { x: p.position.x, y: p.position.y, z: p.position.z, heading: p.heading },
                    health: p.health,
                    armor: p.armour,
                    dimension: p.dimension,
                },
            })
                .catch((err) => logger.debug({ err, rageId: p.id }, 'save_character publish failed'));
        });
    }, autoSaveIntervalMs);
    return { stop: () => clearInterval(timer) };
}
//# sourceMappingURL=character-bridge.js.map