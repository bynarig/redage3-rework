import { z } from 'zod';
import { LoadCharacterWire, SaveCharacterWire, CreateCharacterWire, CharacterDto as CharacterDtoShared, CharacterReply as CharacterReplyShared, CreateCharacterReply as CreateCharacterReplyShared, SaveCustomizationWire, } from '@redage/validators';
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
// Re-export shared shapes so existing consumers keep working.
export const CharacterDto = CharacterDtoShared;
export const PlayerReply = CharacterReplyShared;
export const CreateCharacterReply = CreateCharacterReplyShared;
//# sourceMappingURL=player.js.map