import type { Kafka } from 'kafkajs';
import type { Logger } from '@redage/logger';

export interface TopicSpec {
  topic: string;
  numPartitions: number;
  replicationFactor: number;
  configEntries?: Array<{ name: string; value: string }>;
}

/** Create topics if they don't exist. Safe to call repeatedly. */
export async function ensureTopics(kafka: Kafka, topics: TopicSpec[], logger: Logger): Promise<void> {
  const admin = kafka.admin();
  await admin.connect();
  try {
    const existing = new Set(await admin.listTopics());
    const toCreate = topics.filter((t) => !existing.has(t.topic));
    if (toCreate.length === 0) {
      logger.info({ count: topics.length }, 'all topics already exist');
      return;
    }
    await admin.createTopics({ topics: toCreate, waitForLeaders: true });
    logger.info({ topics: toCreate.map((t) => t.topic) }, 'topics created');
  } finally {
    await admin.disconnect();
  }
}
