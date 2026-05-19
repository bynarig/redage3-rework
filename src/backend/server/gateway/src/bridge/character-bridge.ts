import {
  Topics,
  type PlayerReply,
  type CreateCharacterReply,
} from '@redage/contracts';
import {
  CreateCharacterInput,
  Appearance,
  type Appearance as AppearanceType,
} from '@redage/validators';
import type { Logger } from '@redage/logger';
import type { EventProducer, RpcClient } from '@redage/kafka';
import type { SessionRegistry } from '../session.js';

/**
 * Character creation, selection, and customization bridges.
 *
 * Wire formats:
 *   redage:character:create     (firstname, lastname, gender)              -> RPC
 *   redage:character:select     (characterId)                              -> RPC, applies on spawn
 *   redage:customization:save   (appearance)                               -> fire-and-forget event
 *
 * Why separate save events for position vs customization:
 *  - position changes every frame; we batch it on a 60s autosave timer
 *  - customization changes once per visit to the barber; we save on submit
 *  - keeping them on different cadences avoids head-of-line blocking on
 *    the player-commands topic
 */
export function registerCharacterBridge(deps: {
  rpc: RpcClient;
  producer: EventProducer;
  sessions: SessionRegistry;
  logger: Logger;
  autoSaveIntervalMs?: number;
}): { stop: () => void } {
  const { rpc, producer, sessions, logger } = deps;
  const autoSaveIntervalMs = deps.autoSaveIntervalMs ?? 60_000;

  // ───────────────── create ─────────────────
  mp.events.add('redage:character:create', (...args) => {
    const player = args[0] as Mp.Player;
    const session = sessions.get(player.id);
    if (!session?.accountId || !session.accountLogin) {
      player.call('redage:character:create:reply', [{ ok: false, error: 'not authenticated' }]);
      return;
    }

    const parsed = CreateCharacterInput.safeParse({
      firstname: String(args[1] ?? ''),
      lastname: String(args[2] ?? ''),
      gender: String(args[3] ?? 'MALE'),
    });
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? 'invalid input';
      player.call('redage:character:create:reply', [{ ok: false, error: firstIssue }]);
      return;
    }

    void (async () => {
      try {
        const reply = await rpc.call<CreateCharacterReply>({
          topic: Topics.PlayerCommands,
          key: String(player.id),
          type: 'player.create_character',
          payload: {
            rageId: player.id,
            accountId: session.accountId!,
            accountLogin: session.accountLogin!,
            ...parsed.data,
          },
        });
        player.call('redage:character:create:reply', [reply.payload]);
      } catch (err) {
        logger.error({ err, rageId: player.id }, 'create_character rpc failed');
        player.call('redage:character:create:reply', [{ ok: false, error: 'service unavailable' }]);
      }
    })();
  });

  // ───────────────── select / spawn ─────────────────
  mp.events.add('redage:character:select', (...args) => {
    const player = args[0] as Mp.Player;
    const characterId = Number(args[1] ?? 0);
    if (!characterId) return;

    const session = sessions.get(player.id);
    if (!session?.accountId) {
      player.call('redage:character:reply', [{ ok: false, error: 'not authenticated' }]);
      return;
    }

    void (async () => {
      try {
        const reply = await rpc.call<PlayerReply>({
          topic: Topics.PlayerCommands,
          key: String(player.id),
          type: 'player.load_character',
          payload: { rageId: player.id, accountId: session.accountId!, characterId },
        });
        if (!reply.payload.ok || !reply.payload.character) {
          player.call('redage:character:reply', [reply.payload]);
          return;
        }

        const c = reply.payload.character;
        // Apply position / health / armor.
        player.position = { x: c.position.x, y: c.position.y, z: c.position.z };
        player.heading = c.position.heading;
        player.health = c.health;
        player.armour = c.armor;
        player.dimension = c.dimension;
        session.characterId = c.id;

        // Apply gender model.
        const model = c.gender === 'FEMALE' ? mp.joaat('mp_f_freemode_01') : mp.joaat('mp_m_freemode_01');
        try {
          (player as unknown as { model: number }).model = model;
        } catch (modelErr) {
          logger.warn({ err: modelErr, rageId: player.id }, 'set model failed');
        }

        // Apply appearance — see applyAppearance below for the RAGE:MP API map.
        if (c.appearance) {
          applyAppearance(player, c.appearance, c.gender, logger);
        }

        await producer.publish({
          topic: Topics.PlayerEvents,
          key: String(player.id),
          type: 'player.character_selected',
          payload: { rageId: player.id, accountId: session.accountId!, characterId: c.id },
        });

        player.call('redage:character:reply', [reply.payload]);
      } catch (err) {
        logger.error({ err, rageId: player.id }, 'load_character rpc failed');
        player.call('redage:character:reply', [{ ok: false, error: 'service unavailable' }]);
      }
    })();
  });

  // ───────────────── customization save ─────────────────
  mp.events.add('redage:customization:save', (...args) => {
    const player = args[0] as Mp.Player;
    const session = sessions.get(player.id);
    if (!session?.characterId) {
      player.call('redage:customization:reply', [{ ok: false, error: 'no active character' }]);
      return;
    }

    let appearance: AppearanceType;
    try {
      // The client passes the appearance as a JSON string to keep the
      // mp.callRemote signature small. Validate before forwarding.
      const raw = typeof args[1] === 'string' ? JSON.parse(args[1] as string) : args[1];
      appearance = Appearance.parse(raw);
    } catch (e) {
      player.call('redage:customization:reply', [{ ok: false, error: 'invalid appearance' }]);
      return;
    }

    void (async () => {
      try {
        await producer.publish({
          topic: Topics.PlayerCommands,
          key: String(player.id),
          type: 'player.save_customization',
          payload: { rageId: player.id, characterId: session.characterId!, appearance },
        });
        // Apply immediately to the live player so they see the change.
        const gender = (player as unknown as { model: number }).model === mp.joaat('mp_f_freemode_01')
          ? 'FEMALE'
          : 'MALE';
        applyAppearance(player, appearance, gender, logger);
        player.call('redage:customization:reply', [{ ok: true }]);
      } catch (err) {
        logger.error({ err, rageId: player.id }, 'save_customization publish failed');
        player.call('redage:customization:reply', [{ ok: false, error: 'service unavailable' }]);
      }
    })();
  });

  // ───────────────── periodic autosave ─────────────────
  const timer = setInterval(() => {
    mp.players.forEach((p) => {
      const s = sessions.get(p.id);
      if (!s?.characterId) return;
      void producer
        .publish({
          topic: Topics.PlayerCommands,
          key: String(p.id),
          type: 'player.save_character',
          payload: {
            characterId: s.characterId,
            position: { x: p.position.x, y: p.position.y, z: p.position.z, heading: p.heading },
            health: p.health,
            armor: p.armour,
            dimension: p.dimension,
          },
        })
        .catch((err) => logger.debug({ err, rageId: p.id }, 'save_character publish failed'));
    });
  }, autoSaveIntervalMs);

  return { stop: () => clearInterval(timer) };
}

/**
 * Apply persisted appearance to a live RAGE:MP player.
 *
 * Maps the Appearance shape to RAGE:MP's GTA component/overlay system. The IDs
 * are indexes into our `barber_<Gender>_<Slot>.json` data and map to GTA-V's
 * component / overlay variation field. See:
 *   https://wiki.rage.mp/index.php?title=Player::setHeadOverlay
 *   https://wiki.rage.mp/index.php?title=Player::setComponentVariation
 *
 * Defensive: the RAGE:MP server API surface differs slightly across versions
 * (some builds expose `setHeadOverlay`, others `headOverlay`). We cast to
 * `unknown` and check method existence so a missing API logs a warning
 * instead of crashing the resource.
 */
function applyAppearance(
  player: Mp.Player,
  appearance: AppearanceType,
  gender: 'MALE' | 'FEMALE',
  logger: Logger,
): void {
  const p = player as unknown as {
    setHeadOverlay?: OverlaySetter;
    setHeadOverlayColor?: (overlayId: number, colorType: number, firstColor: number, secondColor: number) => void;
    setComponentVariation?: (componentId: number, drawableId: number, textureId: number, paletteId: number) => void;
    setHairColor?: (firstColor: number, secondColor: number) => void;
    setEyeColor?: (id: number) => void;
  };

  try {
    p.setComponentVariation?.(2, appearance.hairId, 0, 0);
    p.setHairColor?.(0, 0);

    applyOverlay(p, 1, appearance.beardId, gender === 'MALE' ? 1 : 0, 1);
    applyOverlay(p, 2, appearance.eyebrowsId, 1, 1);
    applyOverlay(p, 10, appearance.bodyId, gender === 'MALE' ? 1 : 0, 1);
    p.setEyeColor?.(appearance.eyesId);
    applyOverlay(p, 8, appearance.lipsId, gender === 'FEMALE' ? 1 : 0, 2);
    applyOverlay(p, 5, appearance.paletteId, 1, 2);
    applyOverlay(p, 4, appearance.makeupId, 1, 0);
  } catch (err) {
    logger.warn({ err, rageId: player.id }, 'applyAppearance failed (RAGE:MP api mismatch?)');
  }
}

function applyOverlay(
  player: {
    setHeadOverlay?: OverlaySetter;
    setHeadOverlayColor?: (overlayId: number, colorType: number, firstColor: number, secondColor: number) => void;
  },
  overlayId: number,
  drawableId: number,
  opacity: number,
  colorType: number,
): void {
  if (player.setHeadOverlay) {
    try {
      player.setHeadOverlay(overlayId, [drawableId, opacity, 0, 0]);
    } catch {
      player.setHeadOverlay(overlayId, drawableId, opacity, 0, 0);
    }
  }
  player.setHeadOverlayColor?.(overlayId, colorType, 0, 0);
}

type OverlaySetter = {
  (overlayId: number, value: [number, number, number, number]): void;
  (overlayId: number, drawableId: number, opacity: number, firstColor: number, secondColor: number): void;
};
