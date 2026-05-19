import { describe, it, expect, vi } from 'vitest';
import { handleRegister } from '../handlers/register.js';
import type { RegisterCommandMsg, Envelope } from '@redage/contracts';

const env: Envelope<unknown> = {
  id: 'env-1',
  type: 'auth.register',
  source: 'gateway',
  version: 1,
  occurredAt: new Date().toISOString(),
  payload: null,
} as Envelope<unknown>;

function cmd(): RegisterCommandMsg {
  return {
    type: 'auth.register',
    payload: {
      rageId: 1,
      login: 'jon_doe',
      email: 'jon@example.com',
      password: 'secret1',
      hwid: '',
      ip: '',
      socialClub: '',
    },
  };
}

function makeLogger() {
  return { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn(), child: vi.fn() };
}

describe('handleRegister', () => {
  it('rejects a taken login', async () => {
    const repo = {
      findByLogin: vi.fn().mockResolvedValue({ login: 'jon_doe', email: 'old@x.com', password: 'h', socialClub: '', characters: [], vipLevel: 0, donutCurrency: 0 }),
      findByEmail: vi.fn(),
      create: vi.fn(),
      createSession: vi.fn(),
    };
    const replier = { reply: vi.fn().mockResolvedValue(undefined) };
    await handleRegister(cmd(), env, { repo: repo as never, replier: replier as never, logger: makeLogger() as never });
    expect(replier.reply).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { ok: false, error: 'login already taken' } }),
    );
  });

  it('rejects a taken email', async () => {
    const repo = {
      findByLogin: vi.fn().mockResolvedValue(null),
      findByEmail: vi.fn().mockResolvedValue({ login: 'someone', email: 'jon@example.com', password: 'h', socialClub: '', characters: [], vipLevel: 0, donutCurrency: 0 }),
      create: vi.fn(),
      createSession: vi.fn(),
    };
    const replier = { reply: vi.fn().mockResolvedValue(undefined) };
    await handleRegister(cmd(), env, { repo: repo as never, replier: replier as never, logger: makeLogger() as never });
    expect(replier.reply).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { ok: false, error: 'email already in use' } }),
    );
  });

  it('creates the account on a clean register', async () => {
    const repo = {
      findByLogin: vi.fn().mockResolvedValue(null),
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        login: 'jon_doe',
        email: 'jon@example.com',
        password: 'argon-hash',
        socialClub: '',
        characters: [],
        vipLevel: 0,
        donutCurrency: 0,
      }),
      createSession: vi.fn().mockResolvedValue('session-hash'),
    };
    const replier = { reply: vi.fn().mockResolvedValue(undefined) };

    await handleRegister(cmd(), env, { repo: repo as never, replier: replier as never, logger: makeLogger() as never });

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(replier.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ ok: true, account: expect.objectContaining({ login: 'jon_doe' }) }),
      }),
    );
  });
});
