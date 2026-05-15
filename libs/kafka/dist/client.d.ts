import { type Kafka, type SASLOptions } from 'kafkajs';
export interface KafkaClientOptions {
    clientId: string;
    brokers: string[];
    ssl?: boolean;
    sasl?: SASLOptions;
}
export declare function createKafka(opts: KafkaClientOptions): Kafka;
export declare function brokersFromEnv(): string[];
//# sourceMappingURL=client.d.ts.map