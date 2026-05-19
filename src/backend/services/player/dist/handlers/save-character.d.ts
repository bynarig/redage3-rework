import { type SaveCharacterCommandMsg, type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import { CharacterRepository } from '../repository/character-repo.js';
/**
 * Fire-and-forget save. No reply — the gateway does not wait. Errors are
 * logged so the next save attempt (every minute) gets another shot.
 */
export declare function handleSaveCharacter(cmd: SaveCharacterCommandMsg, _envelope: Envelope<unknown>, deps: {
    repo: CharacterRepository;
    logger: Logger;
}): Promise<void>;
//# sourceMappingURL=save-character.d.ts.map