import { type LoadCharacterCommandMsg, type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import type { Replier } from '@redage/kafka';
import { CharacterRepository } from '../repository/character-repo.js';
export declare function handleLoadCharacter(cmd: LoadCharacterCommandMsg, envelope: Envelope<unknown>, deps: {
    repo: CharacterRepository;
    replier: Replier;
    logger: Logger;
}): Promise<void>;
//# sourceMappingURL=load-character.d.ts.map