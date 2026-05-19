import { describe, it, expect, vi } from 'vitest';
import argon2 from 'argon2';
import { handleLogin } from '../handlers/login.js';
import type { LoginCommandMsg, Envelope } from '@redage/contracts';

function env(): Envelope<unknown> {
  return {
    id: 'env-1',
    type: 'auth.login',
    source: 'gateway',
    version: 1,
    occurredAt: new Date().toISOString(),
    payload: null,
  } as Envelope<unknown>;
}

function cmd(login = 'jon_doe', password = 'secret1'): LoginCommandMsg {
  return {
    type: 'auth.login',
    payload: { rageId: 1, login, password, hwid: '', ip: '', socialClub: '' },
  };
}

function makeLogger() {
  return { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn(), child: vi.fn() };
}

describe('handleLogin', () => {
  it('rejects unknown logins with a generic message (no user-enumeration)', async () => {
    const repo = { findByLogin: vi.fn().mockResolvedValue(null), touchLogin: vi.fn(), createSession: vi.fn() };
    const replier = { reply: vi.fn().mockResolvedValue(undefined) };
    await handleLogin(cmd('ghost'), env(), { repo: repo as never, replier: replier as never, logger: makeLogger() as never });
    expect(replier.reply).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { ok: false, error: 'invalid credentials' } }),
    );
  });

  it('rejects on wrong password with the same generic message', async () => {
    const hash = await argon2.hash('correct', { type: argon2.argon2id });
    const repo = {
      findByLogin: vi.fn().mockResolvedValue({
        login: 'jon_doe',
        email: 'jon@example.com',
        password: hash,
        socialClub: '',
        characters: [],
        vipLevel: 0,
        donutCurrency: 0,
      }),
      touchLogin: vi.fn(),
      createSession: vi.fn(),
    };
    const replier = { reply: vi.fn().mockResolvedValue(undefined) };
    await handleLogin(cmd('jon_doe', 'WRONG'), env(), { repo: repo as never, replier: replier as never, logger: makeLogger() as never });
    expect(replier.reply).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { ok: false, error: 'invalid credentials' } }),
    );
  });

  it('returns the account summary on success and creates a session', async () => {
    const hash = await argon2.hash('secret1', { type: argon2.argon2id });
    const repo = {
      findByLogin: vi.fn().mockResolvedValue({
        login: 'jon_doe',
        email: 'jon@example.com',
        password: hash,
        socialClub: '',
        characters: [1, 2],
        vipLevel: 3,
        donutCurrency: 500,
      }),
      touchLogin: vi.fn().mockResolvedValue(undefined),
      createSession: vi.fn().mockResolvedValue('session-hash'),
    };
    const replier = { reply: vi.fn().mockResolvedValue(undefined) };
    await handleLogin(cmd(), env(), { repo: repo as never, replier: replier as never, logger: makeLogger() as never });

    expect(repo.touchLogin).toHaveBeenCalledTimes(1);
    expect(repo.createSession).toHaveBeenCalledWith('jon_doe');
    expect(replier.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          ok: true,
          account: expect.objectContaining({ login: 'jon_doe', characters: [1, 2], vipLevel: 3, donutCurrency: 500 }),
        }),
      }),
    );
  });

  it('replies "internal error" if anything throws below us', async () => {
    const repo = { findByLogin: vi.fn().mockRejectedValue(new Error('db down')), touchLogin: vi.fn(), createSession: vi.fn() };
    const replier = { reply: vi.fn().mockResolvedValue(undefined) };
    await handleLogin(cmd(), env(), { repo: repo as never, replier: replier as never, logger: makeLogger() as never });
    expect(replier.reply).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { ok: false, error: 'internal error' } }),
    );
  });
});
