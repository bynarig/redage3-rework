import type { Kafka, Producer } from 'kafkajs';
import { buildEnvelope, type Envelope } from '@redage/contracts';
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

export class EventProducer {
  private readonly producer: Producer;
  private connected = false;

  constructor(
    private readonly kafka: Kafka,
    private readonly source: string,
    private readonly logger: Logger,
  ) {
    this.producer = kafka.producer({
      idempotent: true,
      maxInFlightRequests: 5,
      allowAutoTopicCreation: false,
    });
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    await this.producer.connect();
    this.connected = true;
    this.logger.info({ source: this.source }, 'kafka producer connected');
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return;
    await this.producer.disconnect();
    this.connected = false;
  }

  async publish<T>(opts: PublishOptions<T>): Promise<Envelope<T>> {
    const envelope = buildEnvelope({
      type: opts.type,
      source: this.source,
      payload: opts.payload,
      correlationId: opts.correlationId,
      causationId: opts.causationId,
      replyTo: opts.replyTo,
      version: opts.version,
    });

    const headers: Record<string, string> = {
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

    this.logger.debug(
      { topic: opts.topic, type: envelope.type, id: envelope.id, correlationId: envelope.correlationId },
      'event published',
    );

    return envelope;
  }
}
