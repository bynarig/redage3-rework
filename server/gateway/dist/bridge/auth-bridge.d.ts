import type { Logger } from '@redage/logger';
import type { RpcClient } from '@redage/kafka';
import type { SessionRegistry } from '../session.js';
/**
 * Client UI triggers `redage:auth:login` / `redage:auth:register` via mp.events
 * (sent from the CEF UI through the client bundle). We forward each as a Kafka
 * command, wait for the reply, then notify the client UI of the outcome.
 *
 * On success we also stamp the gateway-local session with accountId so future
 * events carry the right identity.
 */
export declare function registerAuthBridge(deps: {
    rpc: RpcClient;
    sessions: SessionRegistry;
    logger: Logger;
}): void;
//# sourceMappingURL=auth-bridge.d.ts.map