import { type CreateCharacterCommandMsg, type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import type { Replier } from '@redage/kafka';
import { CharacterRepository } from '../repository/character-repo.js';
export declare function handleCreateCharacter(cmd: CreateCharacterCommandMsg, envelope: Envelope<unknown>, deps: {
    repo: CharacterRepository;
    replier: Replier;
    logger: Logger;
}): Promise<void>;
//# sourceMappingURL=create-character.d.ts.map