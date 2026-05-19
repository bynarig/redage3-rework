import type { Kafka } from 'kafkajs';
import { type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
export interface PublishOptions<T> {
    topic: string;
    key: string;
    type: string;
    payload: T;
    correlationId?: string;
    causationId?: string;
    replyTo?: string;
    version?: number;
    headers?: Record<string, string>;
}
export declare class EventProducer {
    private readonly kafka;
    private readonly source;
    private readonly logger;
    private readonly producer;
    private connected;
    constructor(kafka: Kafka, source: string, logger: Logger);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    publish<T>(opts: PublishOptions<T>): Promise<Envelope<T>>;
}
//# sourceMappingURL=producer.d.ts.map