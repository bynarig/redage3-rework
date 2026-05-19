import { createUuid, envelopeSchema } from '@redage/contracts';
import { EventProducer } from './producer.js';
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
export class RpcClient {
    kafka;
    opts;
    logger;
    pending = new Map();
    producer;
    started = false;
    constructor(kafka, opts, logger) {
        this.kafka = kafka;
        this.opts = opts;
        this.logger = logger;
        this.producer = new EventProducer(kafka, opts.source, logger);
    }
    async start() {
        if (this.started)
            return;
        await this.producer.connect();
        const consumer = this.kafka.consumer({ groupId: this.opts.consumerGroupId });
        await consumer.connect();
        await consumer.subscribe({ topic: this.opts.replyTopic, fromBeginning: false });
        await consumer.run({
            eachMessage: async ({ message }) => {
                if (!message.value)
                    return;
                let envelope;
                try {
                    envelope = envelopeSchema.parse(JSON.parse(message.value.toString('utf8')));
                }
                catch (err) {
                    this.logger.error({ err }, 'rpc: invalid reply envelope');
                    return;
                }
                const corr = envelope.correlationId;
                if (!corr)
                    return;
                const pending = this.pending.get(corr);
                if (!pending)
                    return;
                clearTimeout(pending.timeout);
                this.pending.delete(corr);
                pending.resolve(envelope);
            },
        });
        this.started = true;
        this.logger.info({ replyTopic: this.opts.replyTopic }, 'rpc client started');
    }
    async call(input) {
        const correlationId = createUuid();
        const timeoutMs = input.timeoutMs ?? this.opts.defaultTimeoutMs ?? 10_000;
        const promise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.pending.delete(correlationId);
                reject(new Error(`rpc timeout after ${timeoutMs}ms (type=${input.type})`));
            }, timeoutMs);
            this.pending.set(correlationId, { resolve, reject, timeout });
        });
        await this.producer.publish({
            topic: input.topic,
            key: input.key,
            type: input.type,
            payload: input.payload,
            correlationId,
            replyTo: this.opts.replyTopic,
        });
        return (await promise);
    }
}
//# sourceMappingURL=rpc.js.map