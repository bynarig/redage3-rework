import kafkaJs from 'kafkajs';
const { Kafka: KafkaClient, logLevel } = kafkaJs;
export function createKafka(opts) {
    const config = {
        clientId: opts.clientId,
        brokers: opts.brokers,
        ssl: opts.ssl,
        sasl: opts.sasl,
        logLevel: logLevel.WARN,
        retry: { initialRetryTime: 300, retries: 8 },
    };
    return new KafkaClient(config);
}
export function brokersFromEnv() {
    const raw = process.env.KAFKA_BROKERS ?? 'localhost:9092';
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
}
//# sourceMappingURL=client.js.map