import argon2 from 'argon2';
import { loginToAccountId } from '../repository/account-repo.js';
export async function handleRegister(cmd, envelope, deps) {
    const { repo, replier, logger } = deps;
    const { login, email, password, hwid, ip, socialClub } = cmd.payload;
    const reply = async (payload) => {
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
    }
    catch (err) {
        logger.error({ err, login }, 'register handler crashed');
        await reply({ ok: false, error: 'internal error' });
    }
}
//# sourceMappingURL=register.js.map