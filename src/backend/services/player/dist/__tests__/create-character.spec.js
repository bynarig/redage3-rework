import { describe, it, expect, vi } from 'vitest';
import { handleCreateCharacter } from '../handlers/create-character.js';
function makeEnv() {
    return {
        id: 'env-1',
        type: 'player.create_character',
        source: 'gateway',
        version: 1,
        occurredAt: new Date().toISOString(),
        payload: null,
    };
}
function makeCmd(overrides = {}) {
    return {
        type: 'player.create_character',
        payload: {
            rageId: 1,
            accountId: 99,
            accountLogin: 'jon_doe',
            firstname: 'Jon',
            lastname: 'Snow',
            gender: 'MALE',
            ...overrides,
        },
    };
}
describe('handleCreateCharacter', () => {
    it('replies with the new characterId on success', async () => {
        const repo = { create: vi.fn().mockResolvedValue({ characterId: 42 }) };
        const replier = { reply: vi.fn().mockResolvedValue(undefined) };
        const logger = { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn(), child: vi.fn() };
        await handleCreateCharacter(makeCmd(), makeEnv(), { repo: repo, replier: replier, logger: logger });
        expect(repo.create).toHaveBeenCalledTimes(1);
        expect(replier.reply).toHaveBeenCalledWith(expect.objectContaining({
            type: 'player.create_character.reply',
            payload: { ok: true, characterId: 42 },
        }));
    });
    it('forwards the account-not-found error message verbatim', async () => {
        const repo = { create: vi.fn().mockRejectedValue(new Error('account not found: ghost')) };
        const replier = { reply: vi.fn().mockResolvedValue(undefined) };
        const logger = { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn(), child: vi.fn() };
        await handleCreateCharacter(makeCmd({ accountLogin: 'ghost' }), makeEnv(), { repo: repo, replier: replier, logger: logger });
        expect(replier.reply).toHaveBeenCalledWith(expect.objectContaining({
            payload: { ok: false, error: 'account not found: ghost' },
        }));
    });
    it('hides any other error behind "internal error" so we never leak Prisma internals', async () => {
        const repo = { create: vi.fn().mockRejectedValue(new Error('PG SQL: column "foo" does not exist')) };
        const replier = { reply: vi.fn().mockResolvedValue(undefined) };
        const logger = { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn(), child: vi.fn() };
        await handleCreateCharacter(makeCmd(), makeEnv(), { repo: repo, replier: replier, logger: logger });
        expect(replier.reply).toHaveBeenCalledWith(expect.objectContaining({ payload: { ok: false, error: 'internal error' } }));
    });
});
//# sourceMappingURL=create-character.spec.js.map