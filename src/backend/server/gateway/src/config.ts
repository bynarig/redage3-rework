import { brokersFromEnv } from '@redage/kafka';
import { optionalEnv } from '@redage/service-runtime';

export const config = {
  serviceName: 'gateway',
  kafka: {
    clientId: optionalEnv('KAFKA_CLIENT_ID', 'redage-gateway'),
    brokers: brokersFromEnv(),
  },
  replyTopic: optionalEnv('GATEWAY_REPLY_TOPIC', 'game.replies.gateway'),
  consumerGroup: optionalEnv('GATEWAY_CONSUMER_GROUP', 'redage-gateway'),
  healthPort: Number(optionalEnv('HEALTH_PORT', '0')),
  /** Throttle position events to this rate per player (ms between sends). */
  positionThrottleMs: Number(optionalEnv('POSITION_THROTTLE_MS', '1000')),
};
