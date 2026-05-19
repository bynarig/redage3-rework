import {type LoadCharacterCommandMsg, type PlayerReply, type Envelope} from '@redage/contracts';
import type {Logger} from '@redage/logger';
import type {Replier} from '@redage/kafka';
import {CharacterRepository} from '../repository/character-repo.js';

export async function handleLoadCharacter(
	cmd: LoadCharacterCommandMsg,
	envelope: Envelope<unknown>,
	deps: { repo: CharacterRepository; replier: Replier; logger: Logger },
): Promise<void> {
	const reply = async (payload: PlayerReply): Promise<void> => {
		await deps.replier.reply({incoming: envelope, type: 'player.reply', payload});
	};

	try {
		const character = await deps.repo.load(cmd.payload.characterId);
		if (!character) {
			await reply({ok: false, error: 'character not found'});
			return;
		}
		await reply({ok: true, character});
	} catch (err) {
		deps.logger.error({err, characterId: cmd.payload.characterId}, 'load_character failed');
		await reply({ok: false, error: 'internal error'});
	}
}
