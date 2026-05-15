import { z } from 'zod';
export declare const PlayerConnectedEvent: z.ZodObject<{
    type: z.ZodLiteral<"player.connected">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        socialClub: z.ZodString;
        name: z.ZodString;
        ip: z.ZodString;
        hwid: z.ZodString;
        serial: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        socialClub: string;
        name: string;
        ip: string;
        hwid: string;
        serial?: string | undefined;
    }, {
        rageId: number;
        socialClub: string;
        name: string;
        ip: string;
        hwid: string;
        serial?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.connected";
    payload: {
        rageId: number;
        socialClub: string;
        name: string;
        ip: string;
        hwid: string;
        serial?: string | undefined;
    };
}, {
    type: "player.connected";
    payload: {
        rageId: number;
        socialClub: string;
        name: string;
        ip: string;
        hwid: string;
        serial?: string | undefined;
    };
}>;
export declare const PlayerDisconnectedEvent: z.ZodObject<{
    type: z.ZodLiteral<"player.disconnected">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        accountId: z.ZodNullable<z.ZodNumber>;
        characterId: z.ZodNullable<z.ZodNumber>;
        reason: z.ZodEnum<["quit", "timeout", "kicked"]>;
        sessionSeconds: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        accountId: number | null;
        characterId: number | null;
        reason: "quit" | "timeout" | "kicked";
        sessionSeconds: number;
    }, {
        rageId: number;
        accountId: number | null;
        characterId: number | null;
        reason: "quit" | "timeout" | "kicked";
        sessionSeconds: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.disconnected";
    payload: {
        rageId: number;
        accountId: number | null;
        characterId: number | null;
        reason: "quit" | "timeout" | "kicked";
        sessionSeconds: number;
    };
}, {
    type: "player.disconnected";
    payload: {
        rageId: number;
        accountId: number | null;
        characterId: number | null;
        reason: "quit" | "timeout" | "kicked";
        sessionSeconds: number;
    };
}>;
export declare const PlayerAuthenticatedEvent: z.ZodObject<{
    type: z.ZodLiteral<"player.authenticated">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        accountId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        accountId: number;
    }, {
        rageId: number;
        accountId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.authenticated";
    payload: {
        rageId: number;
        accountId: number;
    };
}, {
    type: "player.authenticated";
    payload: {
        rageId: number;
        accountId: number;
    };
}>;
export declare const PlayerCharacterSelectedEvent: z.ZodObject<{
    type: z.ZodLiteral<"player.character_selected">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        accountId: z.ZodNumber;
        characterId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        accountId: number;
        characterId: number;
    }, {
        rageId: number;
        accountId: number;
        characterId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.character_selected";
    payload: {
        rageId: number;
        accountId: number;
        characterId: number;
    };
}, {
    type: "player.character_selected";
    payload: {
        rageId: number;
        accountId: number;
        characterId: number;
    };
}>;
export declare const PlayerPositionEvent: z.ZodObject<{
    type: z.ZodLiteral<"player.position">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        characterId: z.ZodNumber;
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        heading: z.ZodNumber;
        dimension: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        characterId: number;
        x: number;
        y: number;
        z: number;
        heading: number;
        dimension: number;
    }, {
        rageId: number;
        characterId: number;
        x: number;
        y: number;
        z: number;
        heading: number;
        dimension: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.position";
    payload: {
        rageId: number;
        characterId: number;
        x: number;
        y: number;
        z: number;
        heading: number;
        dimension: number;
    };
}, {
    type: "player.position";
    payload: {
        rageId: number;
        characterId: number;
        x: number;
        y: number;
        z: number;
        heading: number;
        dimension: number;
    };
}>;
export declare const PlayerDeathEvent: z.ZodObject<{
    type: z.ZodLiteral<"player.death">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        characterId: z.ZodNumber;
        killerRageId: z.ZodNullable<z.ZodNumber>;
        weaponHash: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        characterId: number;
        killerRageId: number | null;
        weaponHash: number;
    }, {
        rageId: number;
        characterId: number;
        killerRageId: number | null;
        weaponHash: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.death";
    payload: {
        rageId: number;
        characterId: number;
        killerRageId: number | null;
        weaponHash: number;
    };
}, {
    type: "player.death";
    payload: {
        rageId: number;
        characterId: number;
        killerRageId: number | null;
        weaponHash: number;
    };
}>;
export declare const PlayerEvent: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"player.connected">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        socialClub: z.ZodString;
        name: z.ZodString;
        ip: z.ZodString;
        hwid: z.ZodString;
        serial: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        socialClub: string;
        name: string;
        ip: string;
        hwid: string;
        serial?: string | undefined;
    }, {
        rageId: number;
        socialClub: string;
        name: string;
        ip: string;
        hwid: string;
        serial?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.connected";
    payload: {
        rageId: number;
        socialClub: string;
        name: string;
        ip: string;
        hwid: string;
        serial?: string | undefined;
    };
}, {
    type: "player.connected";
    payload: {
        rageId: number;
        socialClub: string;
        name: string;
        ip: string;
        hwid: string;
        serial?: string | undefined;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"player.disconnected">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        accountId: z.ZodNullable<z.ZodNumber>;
        characterId: z.ZodNullable<z.ZodNumber>;
        reason: z.ZodEnum<["quit", "timeout", "kicked"]>;
        sessionSeconds: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        accountId: number | null;
        characterId: number | null;
        reason: "quit" | "timeout" | "kicked";
        sessionSeconds: number;
    }, {
        rageId: number;
        accountId: number | null;
        characterId: number | null;
        reason: "quit" | "timeout" | "kicked";
        sessionSeconds: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.disconnected";
    payload: {
        rageId: number;
        accountId: number | null;
        characterId: number | null;
        reason: "quit" | "timeout" | "kicked";
        sessionSeconds: number;
    };
}, {
    type: "player.disconnected";
    payload: {
        rageId: number;
        accountId: number | null;
        characterId: number | null;
        reason: "quit" | "timeout" | "kicked";
        sessionSeconds: number;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"player.authenticated">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        accountId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        accountId: number;
    }, {
        rageId: number;
        accountId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.authenticated";
    payload: {
        rageId: number;
        accountId: number;
    };
}, {
    type: "player.authenticated";
    payload: {
        rageId: number;
        accountId: number;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"player.character_selected">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        accountId: z.ZodNumber;
        characterId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        accountId: number;
        characterId: number;
    }, {
        rageId: number;
        accountId: number;
        characterId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.character_selected";
    payload: {
        rageId: number;
        accountId: number;
        characterId: number;
    };
}, {
    type: "player.character_selected";
    payload: {
        rageId: number;
        accountId: number;
        characterId: number;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"player.position">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        characterId: z.ZodNumber;
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        heading: z.ZodNumber;
        dimension: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        characterId: number;
        x: number;
        y: number;
        z: number;
        heading: number;
        dimension: number;
    }, {
        rageId: number;
        characterId: number;
        x: number;
        y: number;
        z: number;
        heading: number;
        dimension: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.position";
    payload: {
        rageId: number;
        characterId: number;
        x: number;
        y: number;
        z: number;
        heading: number;
        dimension: number;
    };
}, {
    type: "player.position";
    payload: {
        rageId: number;
        characterId: number;
        x: number;
        y: number;
        z: number;
        heading: number;
        dimension: number;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"player.death">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        characterId: z.ZodNumber;
        killerRageId: z.ZodNullable<z.ZodNumber>;
        weaponHash: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        characterId: number;
        killerRageId: number | null;
        weaponHash: number;
    }, {
        rageId: number;
        characterId: number;
        killerRageId: number | null;
        weaponHash: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.death";
    payload: {
        rageId: number;
        characterId: number;
        killerRageId: number | null;
        weaponHash: number;
    };
}, {
    type: "player.death";
    payload: {
        rageId: number;
        characterId: number;
        killerRageId: number | null;
        weaponHash: number;
    };
}>]>;
export type PlayerEvent = z.infer<typeof PlayerEvent>;
//# sourceMappingURL=player.d.ts.map