import { buildEnvelope } from '@redage/contracts';
export class EventProducer {
    kafka;
    source;
    logger;
    producer;
    connected = false;
    constructor(kafka, source, logger) {
        this.kafka = kafka;
        this.source = source;
        this.logger = logger;
        this.producer = kafka.producer({
            idempotent: true,
            maxInFlightRequests: 5,
            allowAutoTopicCreation: false,
        });
    }
    async connect() {
        if (this.connected)
            return;
        await this.producer.connect();
        this.connected = true;
        this.logger.info({ source: this.source }, 'kafka producer connected');
    }
    async disconnect() {
        if (!this.connected)
            return;
        await this.producer.disconnect();
        this.connected = false;
    }
    async publish(opts) {
        const envelope = buildEnvelope({
            type: opts.type,
            source: this.source,
            payload: opts.payload,
            correlationId: opts.correlationId,
            causationId: opts.causationId,
            replyTo: opts.replyTo,
            version: opts.version,
        });
        const headers = {
            'x-envelope-id': envelope.id,
            'x-envelope-type': envelope.type,
            'x-source': envelope.source,
            ...(opts.correlationId && { 'x-correlation-id': opts.correlationId }),
            ...(opts.replyTo && { 'x-reply-to': opts.replyTo }),
            ...opts.headers,
        };
        await this.producer.send({
            topic: opts.topic,
            messages: [{ key: opts.key, value: JSON.stringify(envelope), headers }],
            acks: -1,
        });
        this.logger.debug({ topic: opts.topic, type: envelope.type, id: envelope.id, correlationId: envelope.correlationId }, 'event published');
        return envelope;
    }
}
//# sourceMappingURL=producer.js.map