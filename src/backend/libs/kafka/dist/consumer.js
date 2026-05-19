import { envelopeSchema } from '@redage/contracts';
/**
 * Event-driven consumer. Routes by envelope.type to registered handlers.
 * Each handler is invoked with a schema-validated payload (`message.payload`).
 *
 * Failures bubble up — KafkaJS will not advance the offset, so the message
 * will be retried after the broker's session timeout. For poison-message
 * tolerance, wrap your handler in a try/catch and DLQ via a separate producer.
 */
export class EventConsumer {
    kafka;
    opts;
    logger;
    consumer;
    registry = new Map();
    topics = new Set();
    running = false;
    constructor(kafka, opts, logger) {
        this.kafka = kafka;
        this.opts = opts;
        this.logger = logger;
        this.consumer = kafka.consumer({
            groupId: opts.groupId,
            allowAutoTopicCreation: false,
            sessionTimeout: 30_000,
            heartbeatInterval: 3_000,
        });
    }
    on(topic, type, schema, handler) {
        this.topics.add(topic);
        this.registry.set(`${topic}::${type}`, { schema, handler: handler });
        return this;
    }
    async start() {
        if (this.running)
            return;
        await this.consumer.connect();
        for (const topic of this.topics) {
            await this.consumer.subscribe({ topic, fromBeginning: this.opts.fromBeginning ?? false });
        }
        await this.consumer.run({
            autoCommit: true,
            eachMessage: (payload) => this.handle(payload),
        });
        this.running = true;
        this.logger.info({ groupId: this.opts.groupId, topics: [...this.topics] }, 'kafka consumer running');
    }
    async stop() {
        if (!this.running)
            return;
        await this.consumer.disconnect();
        this.running = false;
    }
    async handle(payload) {
        const { topic, partition, message } = payload;
        if (!message.value)
            return;
        const raw = message.value.toString('utf8');
        let envelope;
        try {
            envelope = envelopeSchema.parse(JSON.parse(raw));
        }
        catch (err) {
            this.logger.error({ err, topic, partition, offset: message.offset }, 'invalid envelope; skipping');
            return;
        }
        const reg = this.registry.get(`${topic}::${envelope.type}`);
        if (!reg) {
            this.logger.debug({ topic, type: envelope.type }, 'no handler registered; skipping');
            return;
        }
        // Parse the fully-typed message (envelope + payload) using the registered schema.
        // Handlers register against the inner discriminated-union member, which expects
        // { type, payload }. We pass that shape, not the whole envelope.
        const parsed = reg.schema.safeParse({ type: envelope.type, payload: envelope.payload });
        if (!parsed.success) {
            this.logger.error({ err: parsed.error.flatten(), topic, type: envelope.type, envelopeId: envelope.id }, 'payload schema mismatch; skipping');
            return;
        }
        const ctx = {
            topic,
            partition,
            offset: message.offset,
            rawValue: raw,
            headers: this.normalizeHeaders(message.headers),
        };
        await reg.handler(parsed.data, envelope, ctx);
    }
    normalizeHeaders(h) {
        const out = {};
        if (!h)
            return out;
        for (const [k, v] of Object.entries(h)) {
            if (v == null)
                continue;
            out[k] = Buffer.isBuffer(v) ? v.toString('utf8') : Array.isArray(v) ? v.map(String).join(',') : String(v);
        }
        return out;
    }
}
//# sourceMappingURL=consumer.js.map