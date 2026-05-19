import type { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { envelopeSchema, type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import type { z, ZodTypeAny } from 'zod';

export type Handler<TSchema extends ZodTypeAny> = (
  message: z.infer<TSchema>,
  envelope: Envelope<unknown>,
  ctx: HandlerContext,
) => Promise<void> | void;

export interface HandlerContext {
  topic: string;
  partition: number;
  offset: string;
  rawValue: string;
  headers: Record<string, string>;
}

interface Registration {
  schema: ZodTypeAny;
  handler: Handler<ZodTypeAny>;
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
export class EventConsumer {
  private readonly consumer: Consumer;
  private readonly registry = new Map<string, Registration>();
  private readonly topics = new Set<string>();
  private running = false;

  constructor(
    private readonly kafka: Kafka,
    private readonly opts: ConsumerOptions,
    private readonly logger: Logger,
  ) {
    this.consumer = kafka.consumer({
      groupId: opts.groupId,
      allowAutoTopicCreation: false,
      sessionTimeout: 30_000,
      heartbeatInterval: 3_000,
    });
  }

  on<TSchema extends ZodTypeAny>(topic: string, type: string, schema: TSchema, handler: Handler<TSchema>): this {
    this.topics.add(topic);
    this.registry.set(`${topic}::${type}`, { schema, handler: handler as Handler<ZodTypeAny> });
    return this;
  }

  async start(): Promise<void> {
    if (this.running) return;
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

  async stop(): Promise<void> {
    if (!this.running) return;
    await this.consumer.disconnect();
    this.running = false;
  }

  private async handle(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    if (!message.value) return;

    const raw = message.value.toString('utf8');
    let envelope: Envelope<unknown>;
    try {
      envelope = envelopeSchema.parse(JSON.parse(raw)) as Envelope<unknown>;
    } catch (err) {
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
      this.logger.error(
        { err: parsed.error.flatten(), topic, type: envelope.type, envelopeId: envelope.id },
        'payload schema mismatch; skipping',
      );
      return;
    }

    const ctx: HandlerContext = {
      topic,
      partition,
      offset: message.offset,
      rawValue: raw,
      headers: this.normalizeHeaders(message.headers),
    };

    await reg.handler(parsed.data, envelope, ctx);
  }

  private normalizeHeaders(h: EachMessagePayload['message']['headers']): Record<string, string> {
    const out: Record<string, string> = {};
    if (!h) return out;
    for (const [k, v] of Object.entries(h)) {
      if (v == null) continue;
      out[k] = Buffer.isBuffer(v) ? v.toString('utf8') : Array.isArray(v) ? v.map(String).join(',') : String(v);
    }
    return out;
  }
}
