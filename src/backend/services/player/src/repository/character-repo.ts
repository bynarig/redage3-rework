import type { PrismaClient } from '@redage/shared';
import { parsePosition, serializePosition, type Position } from '@redage/shared';
import type { CharacterDto } from '@redage/contracts';
import {
  type Appearance,
  type CreateCharacterWire,
  type SaveCharacterWire,
  type SaveCustomizationWire,
  DEFAULT_APPEARANCE,
} from '@redage/validators';

/**
 * Reads/writes a `characters` row + its 1:1 `customization` row.
 *
 * Optimization notes:
 *  - `load()` uses one raw SELECT because the generated Prisma character model
 *    is currently behind the live reworked database column names.
 *  - `save()` only writes the position/health/armor columns we know changed —
 *    no SELECT-then-UPDATE round trip.
 *  - `create()` runs in a transaction so a partial insert leaves nothing behind.
 */
export class CharacterRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(characterId: number): Promise<CharacterDto | null> {
    const rows = await this.prisma.$queryRaw<CharacterRow[]>`
      SELECT
        c.uuid,
        c.firstname,
        c.lastname,
        c.gender::text AS gender,
        c.health,
        c.armor,
        c.money,
        c.bank,
        c.position,
        c.dimension,
        c.is_deleted,
        cu.appearance,
        cu.is_created,
        cu.gender::text AS customization_gender
      FROM characters c
      LEFT JOIN customization cu ON cu.uuid = c.uuid
      WHERE c.uuid = ${characterId}
      LIMIT 1
    `;
    const row = rows[0];
    if (!row || row.is_deleted) return null;

    const pos: Position = parsePosition(row.position);
    const name = `${row.firstname ?? ''} ${row.lastname ?? ''}`.trim() || `#${row.uuid}`;
    const gender = row.gender ?? row.customization_gender ?? 'MALE';

    return {
      id: row.uuid,
      name,
      cash: Number(row.money ?? 0),
      bank: row.bank ?? 0,
      position: { x: pos.x, y: pos.y, z: pos.z, heading: pos.heading },
      health: row.health ?? 100,
      armor: row.armor ?? 0,
      dimension: row.dimension ?? pos.dimension,
      gender: gender === 'FEMALE' ? 'FEMALE' : 'MALE',
      appearance: parseAppearance(row.appearance),
    };
  }

  async save(input: SaveCharacterWire): Promise<void> {
    const position = serializePosition({
      x: input.position.x,
      y: input.position.y,
      z: input.position.z,
      heading: input.position.heading,
      dimension: input.dimension,
    });
    await this.prisma.$executeRaw`
      UPDATE characters
      SET position = ${position},
          dimension = ${input.dimension},
          health = ${input.health},
          armor = ${input.armor}
      WHERE uuid = ${input.characterId}
    `;
  }

  async saveCustomization(input: SaveCustomizationWire): Promise<void> {
    const appearance = JSON.stringify(input.appearance);
    // upsert handles both "first time customizing" and "edit at barber" cases
    // without a SELECT-then-UPDATE round trip.
    await this.prisma.customization.upsert({
      where: { uuid: input.characterId },
      update: { appearance, is_created: true },
      create: { uuid: input.characterId, appearance, is_created: true },
    });
  }

  /**
   * Create a fresh character, its 1:1 customization row, and link it to the
   * account via account_characters + the legacy `accounts.characters` varchar
   * so the existing login flow surfaces it in the character picker.
   */
  async create(input: CreateCharacterWire): Promise<{ characterId: number }> {
    // We need the full account composite PK to write into account_characters.
    // The wire payload carries only the login (the unique handle), so we
    // look up the rest here. findFirst is fine: login is in fact unique even
    // though the legacy schema models it as part of a composite key.
    const account = await this.prisma.accounts.findFirst({
      where: { login: input.accountLogin },
      select: {
        login: true,
        email: true,
        social_club: true,
        characters: true,
        character1: true,
        character2: true,
        character3: true,
      },
    });
    if (!account) throw new Error(`account not found: ${input.accountLogin}`);

    return this.prisma.$transaction(async (tx) => {
      const inserted = await tx.$queryRaw<Array<{ uuid: number }>>`
        INSERT INTO characters (
          firstname,
          lastname,
          gender,
          health,
          armor,
          lvl,
          money,
          create_date,
          selectedquest
        )
        VALUES (
          ${input.firstname},
          ${input.lastname},
          ${input.gender}::character_gender,
          100,
          0,
          1,
          5000,
          NOW(),
          ''
        )
        RETURNING uuid
      `;
      const character = inserted[0];
      if (!character) throw new Error('character insert failed');

      await tx.customization.create({
        data: {
          uuid: character.uuid,
          gender: input.gender,
          appearance: JSON.stringify(DEFAULT_APPEARANCE),
          is_created: false,
        },
      });

      // Append to the legacy `accounts.characters` JSON array so the
      // existing AuthReply path picks the new character up on next login.
      const existing = parseCharacterList(account.characters);
      existing.push(character.uuid);
      const nextSlotIndex = pickFreeSlot([account.character1, account.character2, account.character3]);
      await tx.accounts.updateMany({
        where: { login: account.login, email: account.email, social_club: account.social_club },
        data: {
          characters: JSON.stringify(existing),
          ...(nextSlotIndex === 0 && { character1: character.uuid }),
          ...(nextSlotIndex === 1 && { character2: character.uuid }),
          ...(nextSlotIndex === 2 && { character3: character.uuid }),
          last_select_character_uuid: character.uuid,
        },
      });

      // New normalized link table (added in main_rework.sql stage 1).
      // Use raw because Prisma hasn't been reintrospected to know about it.
      await tx.$executeRaw`
        INSERT INTO account_characters (account_login, account_email, account_social_club, slot_index, character_uuid)
        VALUES (${account.login}, ${account.email}, ${account.social_club}, ${nextSlotIndex}, ${character.uuid})
        ON CONFLICT DO NOTHING
      `;

      return { characterId: character.uuid };
    });
  }
}

interface CharacterRow {
  uuid: number;
  firstname: string | null;
  lastname: string | null;
  gender: 'MALE' | 'FEMALE' | null;
  health: number | null;
  armor: number | null;
  money: bigint | number | null;
  bank: number | null;
  position: string | null;
  dimension: number | null;
  is_deleted: boolean;
  appearance: string | null;
  is_created: boolean | null;
  customization_gender: 'MALE' | 'FEMALE' | null;
}

function parseAppearance(raw: string | null | undefined): Appearance | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Appearance>;
    return {
      hairId: readAppearanceId(parsed.hairId, DEFAULT_APPEARANCE.hairId),
      beardId: readAppearanceId(parsed.beardId, DEFAULT_APPEARANCE.beardId),
      eyebrowsId: readAppearanceId(parsed.eyebrowsId, DEFAULT_APPEARANCE.eyebrowsId),
      bodyId: readAppearanceId(parsed.bodyId, DEFAULT_APPEARANCE.bodyId),
      eyesId: readAppearanceId(parsed.eyesId, DEFAULT_APPEARANCE.eyesId),
      lipsId: readAppearanceId(parsed.lipsId, DEFAULT_APPEARANCE.lipsId),
      paletteId: readAppearanceId(parsed.paletteId, DEFAULT_APPEARANCE.paletteId),
      makeupId: readAppearanceId(parsed.makeupId, DEFAULT_APPEARANCE.makeupId),
    };
  } catch {
    return null;
  }
}

function readAppearanceId(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 255 ? value : fallback;
}

function parseCharacterList(raw: string | null | undefined): number[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n: unknown): n is number => typeof n === 'number' && n > 0);
  } catch {
    return [];
  }
}

function pickFreeSlot(slots: Array<number | null | undefined>): number {
  for (let i = 0; i < slots.length; i++) {
    const v = slots[i];
    if (v === null || v === undefined || v <= 0) return i;
  }
  return slots.length;
}
