import { z } from 'zod';
import { Appearance } from './customization.js';

export const Gender = z.enum(['MALE', 'FEMALE']);
export type Gender = z.infer<typeof Gender>;

/** Character-name rules. Enforced on form, gateway, and service. */
const NAME_REGEX = /^[A-Za-zА-Яа-яЁё]+$/;

const NameField = z
  .string()
  .trim()
  .min(2, 'must be at least 2 chars')
  .max(50, 'must be at most 50 chars')
  .regex(NAME_REGEX, 'letters only — no digits, spaces, or punctuation');

export const CreateCharacterInput = z.object({
  firstname: NameField,
  lastname: NameField,
  gender: Gender,
});
export type CreateCharacterInput = z.infer<typeof CreateCharacterInput>;

export const CreateCharacterWire = CreateCharacterInput.extend({
  rageId: z.number().int().nonnegative(),
  accountId: z.number().int().positive(),
  /**
   * Account login — the unique handle. player-service looks the full account
   * row up by this to populate the account_characters link table.
   * Filled by the gateway from session state, never trusted from the UI.
   */
  accountLogin: z.string().min(3).max(50),
});
export type CreateCharacterWire = z.infer<typeof CreateCharacterWire>;

export const PositionVec = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
  heading: z.number(),
});
export type PositionVec = z.infer<typeof PositionVec>;

export const SaveCharacterWire = z.object({
  characterId: z.number().int().positive(),
  position: PositionVec,
  health: z.number().int().min(0).max(100),
  armor: z.number().int().min(0).max(100),
  dimension: z.number().int().nonnegative(),
});
export type SaveCharacterWire = z.infer<typeof SaveCharacterWire>;

export const LoadCharacterWire = z.object({
  rageId: z.number().int().nonnegative(),
  accountId: z.number().int().positive(),
  characterId: z.number().int().positive(),
});
export type LoadCharacterWire = z.infer<typeof LoadCharacterWire>;

export const CharacterDto = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  cash: z.number().int(),
  bank: z.number().int(),
  position: PositionVec,
  health: z.number().int(),
  armor: z.number().int(),
  dimension: z.number().int().nonnegative(),
  gender: Gender,
  /**
   * Customization is bundled with the character on load so the gateway
   * can apply appearance in a single hop. May be null for legacy chars
   * created before the customization wizard shipped.
   */
  appearance: Appearance.nullable(),
});
export type CharacterDto = z.infer<typeof CharacterDto>;

export const CharacterReply = z.object({
  ok: z.boolean(),
  error: z.string().optional(),
  character: CharacterDto.optional(),
});
export type CharacterReply = z.infer<typeof CharacterReply>;

export const CreateCharacterReply = z.object({
  ok: z.boolean(),
  error: z.string().optional(),
  characterId: z.number().int().positive().optional(),
});
export type CreateCharacterReply = z.infer<typeof CreateCharacterReply>;
