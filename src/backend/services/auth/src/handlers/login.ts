import argon2 from 'argon2';
import {type LoginCommandMsg, type AuthReply, type Envelope} from '@redage/contracts';
import type {Logger} from '@redage/logger';
import type {Replier} from '@redage/kafka';
import {AccountRepository, loginToAccountId} from '../repository/account-repo.js';

export async function handleLogin(
	cmd: LoginCommandMsg,
	envelope: Envelope<unknown>,
	deps: { repo: AccountRepository; replier: Replier; logger: Logger },
): Promise<void> {
	const {repo, replier, logger} = deps;
	const {login, password} = cmd.payload;

	const reply = async (payload: AuthReply): Promise<void> => {
		await replier.reply({incoming: envelope, type: 'auth.reply', payload});
	};

	try {
		const account = await repo.findByLogin(login);
		if (!account) {
			await reply({ok: false, error: 'invalid credentials'});
			return;
		}

		let valid = false;
		try {
			valid = await argon2.verify(account.password, password);
		} catch {
			// Legacy passwords may be SHA-256 hex etc. — extend here.
			valid = false;
		}

		if (!valid) {
			await reply({ok: false, error: 'invalid credentials'});
			return;
		}

		await repo.touchLogin(account.login, cmd.payload.ip);
		const sessionHash = await repo.createSession(account.login);
		logger.info({ login, rageId: cmd.payload.rageId, sessionHash }, 'login ok');
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
		logger.error({err, login}, 'login handler crashed');
		await reply({ok: false, error: 'internal error'});
	}
}
