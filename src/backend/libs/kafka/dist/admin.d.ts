import type { Kafka } from 'kafkajs';
import type { Logger } from '@redage/logger';
export interface TopicSpec {
    topic: string;
    numPartitions: number;
    replicationFactor: number;
    configEntries?: Array<{
        name: string;
        value: string;
    }>;
}
/** Create topics if they don't exist. Safe to call repeatedly. */
export declare function ensureTopics(kafka: Kafka, topics: TopicSpec[], logger: Logger): Promise<void>;
//# sourceMappingURL=admin.d.ts.map