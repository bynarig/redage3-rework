import { type LoginCommandMsg, type Envelope } from '@redage/contracts';
import type { Logger } from '@redage/logger';
import type { Replier } from '@redage/kafka';
import { AccountRepository } from '../repository/account-repo.js';
export declare function handleLogin(cmd: LoginCommandMsg, envelope: Envelope<unknown>, deps: {
    repo: AccountRepository;
    replier: Replier;
    logger: Logger;
}): Promise<void>;
//# sourceMappingURL=login.d.ts.map