export async function handleLoadCharacter(cmd, envelope, deps) {
    const reply = async (payload) => {
        await deps.replier.reply({ incoming: envelope, type: 'player.reply', payload });
    };
    try {
        const character = await deps.repo.load(cmd.payload.characterId);
        if (!character) {
            await reply({ ok: false, error: 'character not found' });
            return;
        }
        await reply({ ok: true, character });
    }
    catch (err) {
        deps.logger.error({ err, characterId: cmd.payload.characterId }, 'load_character failed');
        await reply({ ok: false, error: 'internal error' });
    }
}
//# sourceMappingURL=load-character.js.map