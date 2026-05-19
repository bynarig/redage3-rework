import { Topics } from '@redage/contracts';
/**
 * Client UI triggers `redage:auth:login` / `redage:auth:register` via mp.events
 * (sent from the CEF UI through the client bundle). We forward each as a Kafka
 * command, wait for the reply, then notify the client UI of the outcome.
 *
 * On success we also stamp the gateway-local session with accountId so future
 * events carry the right identity.
 */
export function registerAuthBridge(deps) {
    const { rpc, sessions, logger } = deps;
    const getPlayerIdentity = (player) => ({
        hwid: String(player.hwidHash ?? ''),
        ip: String(player.ip ?? ''),
        socialClub: String(player.socialClub ?? ''),
    });
    mp.events.add('redage:auth:login', (...args) => {
        const player = args[0];
        const login = String(args[1] ?? '');
        const password = String(args[2] ?? '');
        void (async () => {
            try {
                const reply = await rpc.call({
                    topic: Topics.AuthCommands,
                    key: String(player.id),
                    type: 'auth.login',
                    payload: {
                        rageId: player.id,
                        login,
                        password,
                        ...getPlayerIdentity(player),
                    },
                });
                if (reply.payload.ok && reply.payload.account) {
                    const session = sessions.get(player.id);
                    if (session) {
                        session.accountId = reply.payload.account.id;
                        session.accountLogin = reply.payload.account.login;
                    }
                }
                player.call('redage:auth:reply', [reply.payload]);
            }
            catch (err) {
                logger.error({ err, rageId: player.id }, 'auth.login rpc failed');
                player.call('redage:auth:reply', [{ ok: false, error: 'service unavailable' }]);
            }
        })();
    });
    mp.events.add('redage:auth:register', (...args) => {
        const player = args[0];
        const login = String(args[1] ?? '');
        const email = String(args[2] ?? '');
        const password = String(args[3] ?? '');
        void (async () => {
            try {
                const reply = await rpc.call({
                    topic: Topics.AuthCommands,
                    key: String(player.id),
                    type: 'auth.register',
                    payload: {
                        rageId: player.id,
                        login,
                        email,
                        password,
                        ...getPlayerIdentity(player),
                    },
                });
                if (reply.payload.ok && reply.payload.account) {
                    const session = sessions.get(player.id);
                    if (session) {
                        session.accountId = reply.payload.account.id;
                        session.accountLogin = reply.payload.account.login;
                    }
                }
                player.call('redage:auth:reply', [reply.payload]);
            }
            catch (err) {
                logger.error({ err, rageId: player.id }, 'auth.register rpc failed');
                player.call('redage:auth:reply', [{ ok: false, error: 'service unavailable' }]);
            }
        })();
    });
}
//# sourceMappingURL=auth-bridge.js.map