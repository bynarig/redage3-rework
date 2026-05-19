import type { Logger } from '@redage/logger';
import type { EventProducer, RpcClient } from '@redage/kafka';
import type { SessionRegistry } from '../session.js';
/**
 * Character creation, selection, and customization bridges.
 *
 * Wire formats:
 *   redage:character:create     (firstname, lastname, gender)              -> RPC
 *   redage:character:select     (characterId)                              -> RPC, applies on spawn
 *   redage:customization:save   (appearance)                               -> fire-and-forget event
 *
 * Why separate save events for position vs customization:
 *  - position changes every frame; we batch it on a 60s autosave timer
 *  - customization changes once per visit to the barber; we save on submit
 *  - keeping them on different cadences avoids head-of-line blocking on
 *    the player-commands topic
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