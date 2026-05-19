/**
 * Per-player session state held by the gateway only.
 * Game state itself lives in services; this is just the bridge bookkeeping.
 */
export interface PlayerSession {
    rageId: number;
    accountId: number | null;
    /**
     * Account login — kept here so character-creation can identify the owning
     * account without forcing the UI to re-send credentials. Populated on
     * successful login/register.
     */
    accountLogin: string | null;
    characterId: number | null;
    connectedAt: number;
    lastPositionSentAt: number;
}
export declare class SessionRegistry {
    private readonly byRageId;
    create(rageId: number): PlayerSession;
    get(rageId: number): PlayerSession | undefined;
    remove(rageId: number): PlayerSession | undefined;
    size(): number;
}
//# sourceMappingURL=session.d.ts.map