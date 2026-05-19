/**
 * Fire-and-forget. The CEF wizard sends this as the user clicks "Done";
 * we don't block the player on persistence. If the write fails the next
 * autosave or the next wizard submit will reconcile.
 */
export async function handleSaveCustomization(cmd, _envelope, deps) {
    try {
        await deps.repo.saveCustomization(cmd.payload);
        deps.logger.debug({ characterId: cmd.payload.characterId }, 'customization saved');
    }
    catch (err) {
        deps.logger.error({ err, characterId: cmd.payload.characterId }, 'save_customization failed');
    }
}
//# sourceMappingURL=save-customization.js.map