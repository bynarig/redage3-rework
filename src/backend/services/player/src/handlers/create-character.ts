import { type CreateCharacterCommandMsg, type CreateCharacterReply, type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import type { Replier } from '@redage/kafka';
import { CharacterRepository } from '../repository/character-repo.js';

export async function handleCreateCharacter(
  cmd: CreateCharacterCommandMsg,
  envelope: Envelope<unknown>,
  deps: { repo: CharacterRepository; replier: Replier; logger: Logger },
): Promise<void> {
  const reply = async (payload: CreateCharacterReply): Promise<void> => {
    await deps.replier.reply({ incoming: envelope, type: 'player.create_character.reply', payload });
  };

  try {
    const { characterId } = await deps.repo.create(cmd.payload);
    deps.logger.info(
      { characterId, accountLogin: cmd.payload.accountLogin, gender: cmd.payload.gender },
      'character created',
    );
    await reply({ ok: true, characterId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    deps.logger.error({ err, accountLogin: cmd.payload.accountLogin }, 'create_character failed');
    await reply({ ok: false, error: message.startsWith('account') ? message : 'internal error' });
  }
}
