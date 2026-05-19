import { describe, it, expect, vi } from 'vitest';
import { CharacterRepository } from '../repository/character-repo.js';
import type { PrismaClient } from '@redage/shared';

/**
 * These tests use a hand-rolled fake Prisma client. We don't pull a heavy
 * mocking lib because the repository surface is small and explicit.
 */
function fakePrisma(impl: {
  queryRaw?: ReturnType<typeof vi.fn>;
  customizationUpsert?: ReturnType<typeof vi.fn>;
  customizationCreate?: ReturnType<typeof vi.fn>;
  accountsFindFirst?: ReturnType<typeof vi.fn>;
  accountsUpdateMany?: ReturnType<typeof vi.fn>;
  executeRaw?: ReturnType<typeof vi.fn>;
} = {}): PrismaClient {
  const txStub = {
    $queryRaw: impl.queryRaw ?? vi.fn().mockResolvedValue([{ uuid: 100 }]),
    customization: {
      create: impl.customizationCreate ?? vi.fn().mockResolvedValue(undefined),
    },
    accounts: {
      updateMany: impl.accountsUpdateMany ?? vi.fn().mockResolvedValue({ count: 1 }),
    },
    $executeRaw: impl.executeRaw ?? vi.fn().mockResolvedValue(1),
  };

  return {
    $queryRaw: impl.queryRaw ?? vi.fn().mockResolvedValue([]),
    $executeRaw: impl.executeRaw ?? vi.fn().mockResolvedValue(1),
    customization: {
      upsert: impl.customizationUpsert ?? vi.fn().mockResolvedValue(undefined),
    },
    accounts: {
      findFirst: impl.accountsFindFirst ?? vi.fn().mockResolvedValue(null),
    },
    $transaction: vi.fn((cb) => cb(txStub)),
  } as unknown as PrismaClient;
}

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
const appearanceJson = JSON.stringify(appearance);

describe('CharacterRepository.load', () => {
  it('returns null for a deleted character', async () => {
    const prisma = fakePrisma({
      queryRaw: vi.fn().mockResolvedValue([{
        uuid: 1,
        firstname: 'Jon',
        lastname: 'Snow',
        gender: 'MALE',
        health: 100,
        armor: 0,
        money: 0,
        bank: 0,
        position: null,
        dimension: null,
        is_deleted: true,
        appearance: null,
        is_created: null,
        customization_gender: null,
      }]),
    });
    const repo = new CharacterRepository(prisma);
    expect(await repo.load(1)).toBeNull();
  });

  it('returns null if the character does not exist', async () => {
    const prisma = fakePrisma({ queryRaw: vi.fn().mockResolvedValue([]) });
    const repo = new CharacterRepository(prisma);
    expect(await repo.load(999)).toBeNull();
  });

  it('returns the character with parsed appearance', async () => {
    const prisma = fakePrisma({
      queryRaw: vi.fn().mockResolvedValue([{
        uuid: 1,
        firstname: 'Jon',
        lastname: 'Snow',
        gender: 'MALE',
        health: 95,
        armor: 50,
        money: 12345,
        bank: 1000,
        position: '{"x":1,"y":2,"z":3,"heading":90,"dimension":4}',
        dimension: 4,
        is_deleted: false,
        appearance: appearanceJson,
        is_created: true,
        customization_gender: 'MALE',
      }]),
    });
    const repo = new CharacterRepository(prisma);
    const out = await repo.load(1);
    expect(out).toMatchObject({
      id: 1,
      name: 'Jon Snow',
      health: 95,
      armor: 50,
      cash: 12345,
      bank: 1000,
      position: { x: 1, y: 2, z: 3, heading: 90 },
      dimension: 4,
      gender: 'MALE',
      appearance,
    });
  });

  it('returns null appearance when customization row missing', async () => {
    const prisma = fakePrisma({
      queryRaw: vi.fn().mockResolvedValue([{
        uuid: 1,
        firstname: 'Jon',
        lastname: 'Snow',
        gender: 'MALE',
        health: 100,
        armor: 0,
        money: 0,
        bank: 0,
        position: null,
        dimension: null,
        is_deleted: false,
        appearance: null,
        is_created: null,
        customization_gender: null,
      }]),
    });
    const repo = new CharacterRepository(prisma);
    const out = await repo.load(1);
    expect(out?.appearance).toBeNull();
  });

  it('fills new appearance fields when loading legacy four-field JSON', async () => {
    const prisma = fakePrisma({
      queryRaw: vi.fn().mockResolvedValue([{
        uuid: 1,
        firstname: 'Jon',
        lastname: 'Snow',
        gender: 'MALE',
        health: 100,
        armor: 0,
        money: 0,
        bank: 0,
        position: null,
        dimension: null,
        is_deleted: false,
        appearance: '{"bodyId":1,"eyesId":2,"lipsId":3,"makeupId":4}',
        is_created: true,
        customization_gender: 'MALE',
      }]),
    });
    const repo = new CharacterRepository(prisma);
    const out = await repo.load(1);
    expect(out?.appearance).toEqual({
      hairId: 0,
      beardId: 0,
      eyebrowsId: 0,
      bodyId: 1,
      eyesId: 2,
      lipsId: 3,
      paletteId: 0,
      makeupId: 4,
    });
  });

  it('falls back to the legacy name when firstname/lastname are blank', async () => {
    const prisma = fakePrisma({
      queryRaw: vi.fn().mockResolvedValue([{
        uuid: 7,
        firstname: null,
        lastname: null,
        gender: 'FEMALE',
        health: 100,
        armor: 0,
        money: 0,
        bank: 0,
        position: null,
        dimension: null,
        is_deleted: false,
        appearance: null,
        is_created: null,
        customization_gender: null,
      }]),
    });
    const repo = new CharacterRepository(prisma);
    const out = await repo.load(7);
    expect(out?.name).toBe('#7');
  });
});

describe('CharacterRepository.saveCustomization', () => {
  it('upserts the customization row with stringified appearance', async () => {
    const upsert = vi.fn().mockResolvedValue(undefined);
    const prisma = fakePrisma({ customizationUpsert: upsert });
    const repo = new CharacterRepository(prisma);
    await repo.saveCustomization({
      rageId: 1,
      characterId: 5,
      appearance,
    });
    expect(upsert).toHaveBeenCalledWith({
      where: { uuid: 5 },
      update: { appearance: appearanceJson, is_created: true },
      create: {
        uuid: 5,
        appearance: appearanceJson,
        is_created: true,
      },
    });
  });
});

describe('CharacterRepository.create', () => {
  it('throws if the account login does not exist', async () => {
    const prisma = fakePrisma({ accountsFindFirst: vi.fn().mockResolvedValue(null) });
    const repo = new CharacterRepository(prisma);
    await expect(
      repo.create({
        rageId: 1,
        accountId: 99,
        accountLogin: 'ghost',
        firstname: 'Jon',
        lastname: 'Snow',
        gender: 'MALE',
      }),
    ).rejects.toThrow(/account not found: ghost/);
  });

  it('creates character + customization in a transaction and writes to all account-side surfaces', async () => {
    const queryRaw = vi.fn().mockResolvedValue([{ uuid: 200 }]);
    const customizationCreate = vi.fn().mockResolvedValue(undefined);
    const accountsUpdateMany = vi.fn().mockResolvedValue({ count: 1 });
    const executeRaw = vi.fn().mockResolvedValue(1);

    const prisma = fakePrisma({
      accountsFindFirst: vi.fn().mockResolvedValue({
        login: 'jon_doe',
        email: 'jon@example.com',
        social_club: 'jonSC',
        characters: '[]',
        character1: -2,
        character2: -2,
        character3: -2,
      }),
      queryRaw,
      customizationCreate,
      accountsUpdateMany,
      executeRaw,
    });

    const repo = new CharacterRepository(prisma);
    const result = await repo.create({
      rageId: 1,
      accountId: 99,
      accountLogin: 'jon_doe',
      firstname: 'Jon',
      lastname: 'Snow',
      gender: 'MALE',
    });

    expect(result).toEqual({ characterId: 200 });
    expect(queryRaw).toHaveBeenCalledTimes(1);
    expect(customizationCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ uuid: 200, gender: 'MALE', is_created: false }) }),
    );
    expect(accountsUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { login: 'jon_doe', email: 'jon@example.com', social_club: 'jonSC' },
        data: expect.objectContaining({
          characters: '[200]',
          character1: 200,
          last_select_character_uuid: 200,
        }),
      }),
    );
    expect(executeRaw).toHaveBeenCalledTimes(1);
  });
});
