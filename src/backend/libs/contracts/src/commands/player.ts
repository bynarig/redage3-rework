import { z } from 'zod';
import {
  LoadCharacterWire,
  SaveCharacterWire,
  CreateCharacterWire,
  CharacterDto as CharacterDtoShared,
  CharacterReply as CharacterReplyShared,
  CreateCharacterReply as CreateCharacterReplyShared,
  SaveCustomizationWire,
} from '@redage/validators';

export const LoadCharacterCommand = z.object({
  type: z.literal('player.load_character'),
  payload: LoadCharacterWire,
});

export const SaveCharacterCommand = z.object({
  type: z.literal('player.save_character'),
  payload: SaveCharacterWire,
});

export const CreateCharacterCommand = z.object({
  type: z.literal('player.create_character'),
  payload: CreateCharacterWire,
});

export const SaveCustomizationCommand = z.object({
  type: z.literal('player.save_customization'),
  payload: SaveCustomizationWire,
});

export const PlayerCommand = z.discriminatedUnion('type', [
  LoadCharacterCommand,
  SaveCharacterCommand,
  CreateCharacterCommand,
  SaveCustomizationCommand,
]);
export type PlayerCommand = z.infer<typeof PlayerCommand>;
export type LoadCharacterCommandMsg = z.infer<typeof LoadCharacterCommand>;
export type SaveCharacterCommandMsg = z.infer<typeof SaveCharacterCommand>;
export type CreateCharacterCommandMsg = z.infer<typeof CreateCharacterCommand>;
export type SaveCustomizationCommandMsg = z.infer<typeof SaveCustomizationCommand>;

// Re-export shared shapes so existing consumers keep working.
export const CharacterDto = CharacterDtoShared;
export type CharacterDto = z.infer<typeof CharacterDto>;

export const PlayerReply = CharacterReplyShared;
export type PlayerReply = z.infer<typeof PlayerReply>;

export const CreateCharacterReply = CreateCharacterReplyShared;
export type CreateCharacterReply = z.infer<typeof CreateCharacterReply>;
