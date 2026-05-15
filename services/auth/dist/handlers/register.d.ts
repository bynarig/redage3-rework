import { type RegisterCommandMsg, type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import type { Replier } from '@redage/kafka';
import { AccountRepository } from '../repository/account-repo.js';
export declare function handleRegister(cmd: RegisterCommandMsg, envelope: Envelope<unknown>, deps: {
    repo: AccountRepository;
    replier: Replier;
    logger: Logger;
}): Promise<void>;
//# sourceMappingURL=register.d.ts.map