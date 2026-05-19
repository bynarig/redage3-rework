import type { PrismaClient } from '@redage/shared';
/**
 * Maps the legacy `accounts` table to a service-shaped row.
 *
 * The table has a composite PK (login, email, social_club) and no surrogate
 * id, so we derive a stable numeric id from `login` for event envelopes.
 * If/when the schema gets a real BIGSERIAL, replace `loginToAccountId` with
 * the column read and drop this helper.
 */
export interface AccountRow {
    login: string;
    email: string;
    password: string;
    socialClub: string;
    characters: number[];
    vipLevel: number;
    donutCurrency: number;
}
export declare class AccountRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findByLogin(login: string): Promise<AccountRow | null>;
    findByEmail(email: string): Promise<AccountRow | null>;
    create(input: {
        login: string;
        email: string;
        passwordHash: string;
        hwid: string;
        ip: string;
        socialClub: string;
    }): Promise<AccountRow>;
    touchLogin(login: string, ip: string): Promise<void>;
    createSession(login: string): Promise<string>;
}
/** FNV-1a 32-bit. Stable, collision-resistant enough for envelope correlation. */
export declare function loginToAccountId(login: string): number;
//# sourceMappingURL=account-repo.d.ts.map