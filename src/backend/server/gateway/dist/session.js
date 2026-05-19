export class SessionRegistry {
    byRageId = new Map();
    create(rageId) {
        const session = {
            rageId,
            accountId: null,
            accountLogin: null,
            characterId: null,
            connectedAt: Date.now(),
            lastPositionSentAt: 0,
        };
        this.byRageId.set(rageId, session);
        return session;
    }
    get(rageId) {
        return this.byRageId.get(rageId);
    }
    remove(rageId) {
        const s = this.byRageId.get(rageId);
        if (s)
            this.byRageId.delete(rageId);
        return s;
    }
    size() {
        return this.byRageId.size;
    }
}
//# sourceMappingURL=session.js.map