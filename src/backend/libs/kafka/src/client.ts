import kafkaJs, { type Kafka, type KafkaConfig, type SASLOptions } from 'kafkajs';

const { Kafka: KafkaClient, logLevel } = kafkaJs;

export interface KafkaClientOptions {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: SASLOptions;
}

export function createKafka(opts: KafkaClientOptions): Kafka {
  const config: KafkaConfig = {
    clientId: opts.clientId,
    brokers: opts.brokers,
    ssl: opts.ssl,
    sasl: opts.sasl,
    logLevel: logLevel.WARN,
    retry: { initialRetryTime: 300, retries: 8 },
  };
  return new KafkaClient(config);
}

export function brokersFromEnv(): string[] {
  const raw = process.env.KAFKA_BROKERS ?? 'localhost:9092';
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}
