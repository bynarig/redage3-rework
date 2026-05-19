/**
 * Fire-and-forget save. No reply — the gateway does not wait. Errors are
 * logged so the next save attempt (every minute) gets another shot.
 */
export async function handleSaveCharacter(cmd, _envelope, deps) {
    try {
        await deps.repo.save(cmd.payload);
    }
    catch (err) {
        deps.logger.error({ err, characterId: cmd.payload.characterId }, 'save_character failed');
    }
}
//# sourceMappingURL=save-character.js.map