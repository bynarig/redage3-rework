import type { Logger } from '@redage/logger';
import type { EventProducer, RpcClient } from '@redage/kafka';
import type { SessionRegistry } from '../session.js';
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
export declare function registerCharacterBridge(deps: {
    rpc: RpcClient;
    producer: EventProducer;
    sessions: SessionRegistry;
    logger: Logger;
    autoSaveIntervalMs?: number;
}): {
    stop: () => void;
};
//# sourceMappingURL=character-bridge.d.ts.map