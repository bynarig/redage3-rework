import { Topics } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import type { EventProducer } from '@redage/kafka';
import type { SessionRegistry } from '../session.js';

/**
 * Subscribes to RAGE:MP player lifecycle events and publishes them to Kafka.
 * Game logic lives in services; this file is intentionally thin.
 */
export function registerPlayerEventBridge(deps: {
  producer: EventProducer;
  sessions: SessionRegistry;
  logger: Logger;
  positionThrottleMs: number;
}): void {
  const { producer, sessions, logger, positionThrottleMs } = deps;

  mp.events.add('playerJoin', (...args) => {
    const player = args[0] as Mp.Player;
    const session = sessions.create(player.id);
    void producer
      .publish({
        topic: Topics.PlayerEvents,
        key: String(player.id),
        type: 'player.connected',
        payload: {
          rageId: player.id,
          socialClub: player.socialClub,
          name: player.name,
          ip: player.ip,
          hwid: player.hwidHash,
          serial: player.serial,
        },
      })
      .catch((err) => logger.error({ err, rageId: player.id }, 'failed to publish player.connected'));
    logger.info({ rageId: player.id, name: player.name, total: sessions.size() }, 'player joined');
    void session;
  });

  mp.events.add('playerQuit', (...args) => {
    const player = args[0] as Mp.Player;
    const reasonRaw = args[1] as string | undefined;
    const session = sessions.remove(player.id);
    if (!session) return;
    const reason: 'quit' | 'timeout' | 'kicked' =
      reasonRaw === 'kicked' ? 'kicked' : reasonRaw === 'timeout' ? 'timeout' : 'quit';
    void producer
      .publish({
        topic: Topics.PlayerEvents,
        key: String(player.id),
        type: 'player.disconnected',
        payload: {
          rageId: player.id,
          accountId: session.accountId,
          characterId: session.characterId,
          reason,
          sessionSeconds: Math.floor((Date.now() - session.connectedAt) / 1000),
        },
      })
      .catch((err) => logger.error({ err, rageId: player.id }, 'failed to publish player.disconnected'));
    logger.info({ rageId: player.id, reason }, 'player quit');
  });

  mp.events.add('playerDeath', (...args) => {
    const player = args[0] as Mp.Player;
    const killer = args[1] as Mp.Player | undefined;
    const weaponHash = (args[2] as number | undefined) ?? 0;
    const session = sessions.get(player.id);
    if (!session?.characterId) return;
    void producer
      .publish({
        topic: Topics.PlayerEvents,
        key: String(player.id),
        type: 'player.death',
        payload: {
          rageId: player.id,
          characterId: session.characterId,
          killerRageId: killer?.id ?? null,
          weaponHash,
        },
      })
      .catch((err) => logger.error({ err, rageId: player.id }, 'failed to publish player.death'));
  });

  // Throttled position telemetry. Triggered by client every tick; we sample.
  mp.events.add('redage:position', (...args) => {
    const player = args[0] as Mp.Player;
    const session = sessions.get(player.id);
    if (!session?.characterId) return;
    const now = Date.now();
    if (now - session.lastPositionSentAt < positionThrottleMs) return;
    session.lastPositionSentAt = now;

    const pos = player.position;
    void producer
      .publish({
        topic: Topics.PlayerEvents,
        key: String(player.id),
        type: 'player.position',
        payload: {
          rageId: player.id,
          characterId: session.characterId,
          x: pos.x,
          y: pos.y,
          z: pos.z,
          heading: player.heading,
          dimension: player.dimension,
        },
      })
      .catch((err) => logger.debug({ err }, 'position publish failed'));
  });
}
