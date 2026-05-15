import { z } from 'zod';
export declare const LoadCharacterCommand: z.ZodObject<{
    type: z.ZodLiteral<"player.load_character">;
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
    type: "player.load_character";
    payload: {
        rageId: number;
        accountId: number;
        characterId: number;
    };
}, {
    type: "player.load_character";
    payload: {
        rageId: number;
        accountId: number;
        characterId: number;
    };
}>;
export declare const SaveCharacterCommand: z.ZodObject<{
    type: z.ZodLiteral<"player.save_character">;
    payload: z.ZodObject<{
        characterId: z.ZodNumber;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            heading: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            heading: number;
        }, {
            x: number;
            y: number;
            z: number;
            heading: number;
        }>;
        health: z.ZodNumber;
        armor: z.ZodNumber;
        dimension: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        characterId: number;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
    }, {
        characterId: number;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.save_character";
    payload: {
        characterId: number;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
    };
}, {
    type: "player.save_character";
    payload: {
        characterId: number;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
    };
}>;
export declare const PlayerCommand: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"player.load_character">;
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
    type: "player.load_character";
    payload: {
        rageId: number;
        accountId: number;
        characterId: number;
    };
}, {
    type: "player.load_character";
    payload: {
        rageId: number;
        accountId: number;
        characterId: number;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"player.save_character">;
    payload: z.ZodObject<{
        characterId: z.ZodNumber;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            heading: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            heading: number;
        }, {
            x: number;
            y: number;
            z: number;
            heading: number;
        }>;
        health: z.ZodNumber;
        armor: z.ZodNumber;
        dimension: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        characterId: number;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
    }, {
        characterId: number;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.save_character";
    payload: {
        characterId: number;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
    };
}, {
    type: "player.save_character";
    payload: {
        characterId: number;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
    };
}>]>;
export type PlayerCommand = z.infer<typeof PlayerCommand>;
export type LoadCharacterCommandMsg = z.infer<typeof LoadCharacterCommand>;
export type SaveCharacterCommandMsg = z.infer<typeof SaveCharacterCommand>;
export declare const CharacterDto: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    cash: z.ZodNumber;
    bank: z.ZodNumber;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodNumber;
        heading: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z: number;
        heading: number;
    }, {
        x: number;
        y: number;
        z: number;
        heading: number;
    }>;
    health: z.ZodNumber;
    armor: z.ZodNumber;
    dimension: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    dimension: number;
    position: {
        x: number;
        y: number;
        z: number;
        heading: number;
    };
    health: number;
    armor: number;
    cash: number;
    bank: number;
}, {
    id: number;
    name: string;
    dimension: number;
    position: {
        x: number;
        y: number;
        z: number;
        heading: number;
    };
    health: number;
    armor: number;
    cash: number;
    bank: number;
}>;
export type CharacterDto = z.infer<typeof CharacterDto>;
export declare const PlayerReply: z.ZodObject<{
    ok: z.ZodBoolean;
    error: z.ZodOptional<z.ZodString>;
    character: z.ZodOptional<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        cash: z.ZodNumber;
        bank: z.ZodNumber;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
            heading: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
            heading: number;
        }, {
            x: number;
            y: number;
            z: number;
            heading: number;
        }>;
        health: z.ZodNumber;
        armor: z.ZodNumber;
        dimension: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        cash: number;
        bank: number;
    }, {
        id: number;
        name: string;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        cash: number;
        bank: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    ok: boolean;
    error?: string | undefined;
    character?: {
        id: number;
        name: string;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        cash: number;
        bank: number;
    } | undefined;
}, {
    ok: boolean;
    error?: string | undefined;
    character?: {
        id: number;
        name: string;
        dimension: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        cash: number;
        bank: number;
    } | undefined;
}>;
export type PlayerReply = z.infer<typeof PlayerReply>;
//# sourceMappingURL=player.d.ts.map