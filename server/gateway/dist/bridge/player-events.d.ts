import type { Logger } from '@redage/logger';
import type { EventProducer } from '@redage/kafka';
import type { SessionRegistry } from '../session.js';
/**
 * Subscribes to RAGE:MP player lifecycle events and publishes them to Kafka.
 * Game logic lives in services; this file is intentionally thin.
 */
export declare function registerPlayerEventBridge(deps: {
    producer: EventProducer;
    sessions: SessionRegistry;
    logger: Logger;
    positionThrottleMs: number;
}): void;
//# sourceMappingURL=player-events.d.ts.map