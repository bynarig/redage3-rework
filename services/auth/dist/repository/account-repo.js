import { createUuid } from '@redage/contracts';
export class AccountRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByLogin(login) {
        const row = await this.prisma.accounts.findFirst({ where: { login } });
        return row ? toAccountRow(row) : null;
    }
    async findByEmail(email) {
        const row = await this.prisma.accounts.findFirst({ where: { email } });
        return row ? toAccountRow(row) : null;
    }
    async create(input) {
        const row = await this.prisma.accounts.create({
            data: {
                login: input.login,
                email: input.email,
                password: input.passwordHash,
                hwid: input.hwid,
                ip: input.ip,
                social_club: input.socialClub,
                vip_lvl: 0,
                vip_date: new Date(0),
                promo_codes: '',
                bonus_codes: '',
                character1: -2,
                character2: -2,
                character3: -2,
            },
        });
        return toAccountRow(row);
    }
    async touchLogin(login, ip) {
        // The legacy schema lacks a `last_login` column — we update `ip` so we at
        // least record the most-recent connection address. Replace with a real
        // login-history table once the schema rework lands.
        await this.prisma.accounts.updateMany({ where: { login }, data: { ip } });
    }
    async createSession(login) {
        const hash = createUuid();
        await this.prisma.$executeRaw `
      INSERT INTO "sessions" ("hash", "login", "data", "oneTime")
      VALUES (${hash}, ${login}, ${new Date()}, 0)
    `;
        return hash;
    }
}
function toAccountRow(row) {
    let characters = [];
    try {
        const parsed = JSON.parse(row.characters);
        if (Array.isArray(parsed))
            characters = parsed.filter((n) => typeof n === 'number' && n > 0);
    }
    catch {
        /* legacy garbage; leave empty */
    }
    return {
        login: row.login,
        email: row.email,
        password: row.password,
        socialClub: row.social_club,
        characters,
        vipLevel: row.vip_lvl,
        donutCurrency: row.donut_currency,
    };
}
/** FNV-1a 32-bit. Stable, collision-resistant enough for envelope correlation. */
export function loginToAccountId(login) {
    let hash = 2166136261;
    for (let i = 0; i < login.length; i++) {
        hash ^= login.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}
//# sourceMappingURL=account-repo.js.map