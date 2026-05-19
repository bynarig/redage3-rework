import { describe, it, expect, vi } from 'vitest';
import { handleSaveCustomization } from '../handlers/save-customization.js';
const env = {
    id: 'env-1',
    type: 'player.save_customization',
    source: 'gateway',
    version: 1,
    occurredAt: new Date().toISOString(),
    payload: null,
};
const appearance = {
    hairId: 1,
    beardId: 2,
    eyebrowsId: 3,
    bodyId: 4,
    eyesId: 5,
    lipsId: 6,
    paletteId: 7,
    makeupId: 8,
};
const cmd = {
    type: 'player.save_customization',
    payload: { rageId: 1, characterId: 7, appearance },
};
describe('handleSaveCustomization', () => {
    it('delegates to repo.saveCustomization', async () => {
        const repo = { saveCustomization: vi.fn().mockResolvedValue(undefined) };
        const logger = { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn(), child: vi.fn() };
        await handleSaveCustomization(cmd, env, { repo: repo, logger: logger });
        expect(repo.saveCustomization).toHaveBeenCalledWith(cmd.payload);
    });
    it('swallows errors (fire-and-forget) but logs them', async () => {
        const repo = { saveCustomization: vi.fn().mockRejectedValue(new Error('boom')) };
        const logger = { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn(), child: vi.fn() };
        await expect(handleSaveCustomization(cmd, env, { repo: repo, logger: logger })).resolves.toBeUndefined();
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=save-customization.spec.js.map