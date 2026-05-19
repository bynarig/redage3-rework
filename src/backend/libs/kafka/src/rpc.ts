import type { Kafka } from 'kafkajs';
import { createUuid, envelopeSchema, type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import { EventProducer } from './producer.js';

interface PendingCall {
  resolve: (value: Envelope<unknown>) => void;
  reject: (reason: Error) => void;
  timeout: NodeJS.Timeout;
}

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
  private readonly pending = new Map<string, PendingCall>();
  private readonly producer: EventProducer;
  private started = false;

  constructor(
    private readonly kafka: Kafka,
    private readonly opts: {
      source: string;
      replyTopic: string;
      consumerGroupId: string;
      defaultTimeoutMs?: number;
    },
    private readonly logger: Logger,
  ) {
    this.producer = new EventProducer(kafka, opts.source, logger);
  }

  async start(): Promise<void> {
    if (this.started) return;
    await this.producer.connect();

    const consumer = this.kafka.consumer({ groupId: this.opts.consumerGroupId });
    await consumer.connect();
    await consumer.subscribe({ topic: this.opts.replyTopic, fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        let envelope: Envelope<unknown>;
        try {
          envelope = envelopeSchema.parse(JSON.parse(message.value.toString('utf8'))) as Envelope<unknown>;
        } catch (err) {
          this.logger.error({ err }, 'rpc: invalid reply envelope');
          return;
        }
        const corr = envelope.correlationId;
        if (!corr) return;
        const pending = this.pending.get(corr);
        if (!pending) return;
        clearTimeout(pending.timeout);
        this.pending.delete(corr);
        pending.resolve(envelope);
      },
    });

    this.started = true;
    this.logger.info({ replyTopic: this.opts.replyTopic }, 'rpc client started');
  }

  async call<TReply>(input: {
    topic: string;
    key: string;
    type: string;
    payload: unknown;
    timeoutMs?: number;
  }): Promise<Envelope<TReply>> {
    const correlationId = createUuid();
    const timeoutMs = input.timeoutMs ?? this.opts.defaultTimeoutMs ?? 10_000;

    const promise = new Promise<Envelope<unknown>>((resolve, reject) => {
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

    return (await promise) as Envelope<TReply>;
  }
}
