import { describe, expect, it } from 'vitest';
import { LoginInput, RegisterInput, AuthReply } from '../auth.js';

describe('LoginInput', () => {
  it('accepts a normal login', () => {
    expect(LoginInput.safeParse({ login: 'jon_doe', password: 'secret1' }).success).toBe(true);
  });

  it.each([
    ['too short', { login: 'ab', password: 'secret1' }],
    ['too long', { login: 'a'.repeat(51), password: 'secret1' }],
    ['space inside', { login: 'jon doe', password: 'secret1' }],
    ['cyrillic', { login: 'жонСнег', password: 'secret1' }],
    ['short password', { login: 'jon_doe', password: '12345' }],
  ])('rejects %s', (_label, input) => {
    expect(LoginInput.safeParse(input).success).toBe(false);
  });

  it('trims whitespace around the login', () => {
    const parsed = LoginInput.parse({ login: '  jon  ', password: 'secret1' });
    expect(parsed.login).toBe('jon');
  });
});

describe('RegisterInput', () => {
  it('accepts a complete registration', () => {
    expect(
      RegisterInput.safeParse({
        login: 'jon_doe',
        email: 'jon@example.com',
        password: 'secret1',
      }).success,
    ).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(
      RegisterInput.safeParse({
        login: 'jon_doe',
        email: 'not-an-email',
        password: 'secret1',
      }).success,
    ).toBe(false);
  });
});

describe('AuthReply', () => {
  it('roundtrips an ok payload', () => {
    const payload = {
      ok: true,
      account: {
        id: 42,
        login: 'jon_doe',
        characters: [1, 2, 3],
        vipLevel: 0,
        donutCurrency: 100,
      },
    };
    expect(AuthReply.parse(payload)).toEqual(payload);
  });

  it('accepts a bare error reply', () => {
    expect(AuthReply.parse({ ok: false, error: 'nope' })).toEqual({ ok: false, error: 'nope' });
  });
});
