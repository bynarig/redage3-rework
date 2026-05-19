import { type SaveCustomizationCommandMsg, type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import { CharacterRepository } from '../repository/character-repo.js';

/**
 * Fire-and-forget. The CEF wizard sends this as the user clicks "Done";
 * we don't block the player on persistence. If the write fails the next
 * autosave or the next wizard submit will reconcile.
 */
export async function handleSaveCustomization(
  cmd: SaveCustomizationCommandMsg,
  _envelope: Envelope<unknown>,
  deps: { repo: CharacterRepository; logger: Logger },
): Promise<void> {
  try {
    await deps.repo.saveCustomization(cmd.payload);
    deps.logger.debug({ characterId: cmd.payload.characterId }, 'customization saved');
  } catch (err) {
    deps.logger.error({ err, characterId: cmd.payload.characterId }, 'save_customization failed');
  }
}
