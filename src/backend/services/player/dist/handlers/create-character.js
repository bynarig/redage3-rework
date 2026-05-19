export async function handleCreateCharacter(cmd, envelope, deps) {
    const reply = async (payload) => {
        await deps.replier.reply({ incoming: envelope, type: 'player.create_character.reply', payload });
    };
    try {
        const { characterId } = await deps.repo.create(cmd.payload);
        deps.logger.info({ characterId, accountLogin: cmd.payload.accountLogin, gender: cmd.payload.gender }, 'character created');
        await reply({ ok: true, characterId });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        deps.logger.error({ err, accountLogin: cmd.payload.accountLogin }, 'create_character failed');
        await reply({ ok: false, error: message.startsWith('account') ? message : 'internal error' });
    }
}
//# sourceMappingURL=create-character.js.map