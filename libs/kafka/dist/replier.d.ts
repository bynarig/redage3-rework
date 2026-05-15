import type { Kafka } from 'kafkajs';
import type { Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
/**
 * Helper for services that consume commands and need to reply on `replyTo`,
 * echoing the original correlationId.
 */
export declare class Replier {
    private readonly producer;
    constructor(kafka: Kafka, source: string, logger: Logger);
    start(): Promise<void>;
    stop(): Promise<void>;
    reply<T>(input: {
        incoming: Envelope<unknown>;
        type: string;
        payload: T;
        key?: string;
    }): Promise<void>;
}
//# sourceMappingURL=replier.d.ts.map