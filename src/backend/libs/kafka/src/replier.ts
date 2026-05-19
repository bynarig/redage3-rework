import type { Kafka } from 'kafkajs';
import type { Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import { EventProducer } from './producer.js';

/**
 * Helper for services that consume commands and need to reply on `replyTo`,
 * echoing the original correlationId.
 */
export class Replier {
  private readonly producer: EventProducer;

  constructor(kafka: Kafka, source: string, logger: Logger) {
    this.producer = new EventProducer(kafka, source, logger);
  }

  async start(): Promise<void> {
    await this.producer.connect();
  }

  async stop(): Promise<void> {
    await this.producer.disconnect();
  }

  async reply<T>(input: {
    incoming: Envelope<unknown>;
    type: string;
    payload: T;
    key?: string;
  }): Promise<void> {
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
