import { EventProducer } from './producer.js';
/**
 * Helper for services that consume commands and need to reply on `replyTo`,
 * echoing the original correlationId.
 */
export class Replier {
    producer;
    constructor(kafka, source, logger) {
        this.producer = new EventProducer(kafka, source, logger);
    }
    async start() {
        await this.producer.connect();
    }
    async stop() {
        await this.producer.disconnect();
    }
    async reply(input) {
        if (!input.incoming.replyTo) {
            throw new Error(`cannot reply: envelope ${input.incoming.id} has no replyTo`);
        }
        if (!input.incoming.correlationId) {
            throw new Error(`cannot reply: envelope ${input.incoming.id} has no correlationId`);
        }
        await this.producer.publish({
            topic: input.incoming.replyTo,
            key: input.key ?? input.incoming.id,
            type: input.type,
            payload: input.payload,
            correlationId: input.incoming.correlationId,
            causationId: input.incoming.id,
        });
    }
}
//# sourceMappingURL=replier.js.map