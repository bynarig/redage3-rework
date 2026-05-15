import type { Kafka } from 'kafkajs';
import { type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import type { z, ZodTypeAny } from 'zod';
export type Handler<TSchema extends ZodTypeAny> = (message: z.infer<TSchema>, envelope: Envelope<unknown>, ctx: HandlerContext) => Promise<void> | void;
export interface HandlerContext {
    topic: string;
    partition: number;
    offset: string;
    rawValue: string;
    headers: Record<string, string>;
}
export interface ConsumerOptions {
    groupId: string;
    fromBeginning?: boolean;
    /** Number of seconds to wait before retrying a failed message. */
    retryDelayMs?: number;
}
/**
 * Event-driven consumer. Routes by envelope.type to registered handlers.
 * Each handler is invoked with a schema-validated payload (`message.payload`).
 *
 * Failures bubble up — KafkaJS will not advance the offset, so the message
 * will be retried after the broker's session timeout. For poison-message
 * tolerance, wrap your handler in a try/catch and DLQ via a separate producer.
 */
export declare class EventConsumer {
    private readonly kafka;
    private readonly opts;
    private readonly logger;
    private readonly consumer;
    private readonly registry;
    private readonly topics;
    private running;
    constructor(kafka: Kafka, opts: ConsumerOptions, logger: Logger);
    on<TSchema extends ZodTypeAny>(topic: string, type: string, schema: TSchema, handler: Handler<TSchema>): this;
    start(): Promise<void>;
    stop(): Promise<void>;
    private handle;
    private normalizeHeaders;
}
//# sourceMappingURL=consumer.d.ts.map