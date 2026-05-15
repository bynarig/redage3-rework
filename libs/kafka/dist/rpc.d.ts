import type { Kafka } from 'kafkajs';
import { type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
/**
 * Request/response over Kafka via the correlationId pattern.
 *
 * - The caller publishes a command with `replyTo` = its unique reply topic
 *   and a fresh `correlationId`.
 * - The callee handles the command and publishes a reply to `replyTo`,
 *   echoing `correlationId`.
 * - This client consumes its own reply topic and resolves the pending promise.
 *
 * Each service should have ONE RpcClient with a unique reply topic
 * (e.g. `game.replies.gateway`) and one consumer group.
 */
export declare class RpcClient {
    private readonly kafka;
    private readonly opts;
    private readonly logger;
    private readonly pending;
    private readonly producer;
    private started;
    constructor(kafka: Kafka, opts: {
        source: string;
        replyTopic: string;
        consumerGroupId: string;
        defaultTimeoutMs?: number;
    }, logger: Logger);
    start(): Promise<void>;
    call<TReply>(input: {
        topic: string;
        key: string;
        type: string;
        payload: unknown;
        timeoutMs?: number;
    }): Promise<Envelope<TReply>>;
}
//# sourceMappingURL=rpc.d.ts.map