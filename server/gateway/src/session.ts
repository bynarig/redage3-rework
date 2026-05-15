/**
 * Per-player session state held by the gateway only.
 * Game state itself lives in services; this is just the bridge bookkeeping.
 */
export interface PlayerSession {
  rageId: number;
  accountId: number | null;
  characterId: number | null;
  connectedAt: number;
  lastPositionSentAt: number;
}

export class SessionRegistry {
  private readonly byRageId = new Map<number, PlayerSession>();

  create(rageId: number): PlayerSession {
    const session: PlayerSession = {
      rageId,
      accountId: null,
      characterId: null,
      connectedAt: Date.now(),
      lastPositionSentAt: 0,
    };
    this.byRageId.set(rageId, session);
    return session;
  }

  get(rageId: number): PlayerSession | undefined {
    return this.byRageId.get(rageId);
  }

  remove(rageId: number): PlayerSession | undefined {
    const s = this.byRageId.get(rageId);
    if (s) this.byRageId.delete(rageId);
    return s;
  }

  size(): number {
    return this.byRageId.size;
  }
}
