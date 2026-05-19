import argon2 from 'argon2';
import { type RegisterCommandMsg, type AuthReply, type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import type { Replier } from '@redage/kafka';
import { AccountRepository, loginToAccountId } from '../repository/account-repo.js';

export async function handleRegister(
  cmd: RegisterCommandMsg,
  envelope: Envelope<unknown>,
  deps: { repo: AccountRepository; replier: Replier; logger: Logger },
): Promise<void> {
  const { repo, replier, logger } = deps;
  const { login, email, password, hwid, ip, socialClub } = cmd.payload;

  const reply = async (payload: AuthReply): Promise<void> => {
    await replier.reply({ incoming: envelope, type: 'auth.reply', payload });
  };

  try {
    if (await repo.findByLogin(login)) {
      await reply({ ok: false, error: 'login already taken' });
      return;
    }
    if (await repo.findByEmail(email)) {
      await reply({ ok: false, error: 'email already in use' });
      return;
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const account = await repo.create({ login, email, passwordHash, hwid, ip, socialClub });
    const sessionHash = await repo.createSession(account.login);

    logger.info({ login, email, sessionHash }, 'account created');
    await reply({
      ok: true,
      account: {
        id: loginToAccountId(account.login),
        login: account.login,
        characters: account.characters,
        vipLevel: account.vipLevel,
        donutCurrency: account.donutCurrency,
      },
    });
  } catch (err) {
    logger.error({ err, login }, 'register handler crashed');
    await reply({ ok: false, error: 'internal error' });
  }
}
