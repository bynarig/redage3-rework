import { z } from 'zod';
export declare const LoadCharacterCommand: z.ZodObject<{
    type: z.ZodLiteral<"player.load_character">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        accountId: z.ZodNumber;
        characterId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        characterId: number;
        accountId: number;
    }, {
        rageId: number;
        characterId: number;
        accountId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.load_character";
    payload: {
        rageId: number;
        characterId: number;
        accountId: number;
    };
}, {
    type: "player.load_character";
    payload: {
        rageId: number;
        characterId: number;
        accountId: number;
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
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
    }, {
        characterId: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.save_character";
    payload: {
        characterId: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
    };
}, {
    type: "player.save_character";
    payload: {
        characterId: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
    };
}>;
export declare const CreateCharacterCommand: z.ZodObject<{
    type: z.ZodLiteral<"player.create_character">;
    payload: z.ZodObject<{
        firstname: z.ZodString;
        lastname: z.ZodString;
        gender: z.ZodEnum<["MALE", "FEMALE"]>;
    } & {
        rageId: z.ZodNumber;
        accountId: z.ZodNumber;
        accountLogin: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        firstname: string;
        lastname: string;
        gender: "MALE" | "FEMALE";
        accountId: number;
        accountLogin: string;
    }, {
        rageId: number;
        firstname: string;
        lastname: string;
        gender: "MALE" | "FEMALE";
        accountId: number;
        accountLogin: string;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.create_character";
    payload: {
        rageId: number;
        firstname: string;
        lastname: string;
        gender: "MALE" | "FEMALE";
        accountId: number;
        accountLogin: string;
    };
}, {
    type: "player.create_character";
    payload: {
        rageId: number;
        firstname: string;
        lastname: string;
        gender: "MALE" | "FEMALE";
        accountId: number;
        accountLogin: string;
    };
}>;
export declare const SaveCustomizationCommand: z.ZodObject<{
    type: z.ZodLiteral<"player.save_customization">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        characterId: z.ZodNumber;
        appearance: z.ZodObject<{
            hairId: z.ZodNumber;
            beardId: z.ZodNumber;
            eyebrowsId: z.ZodNumber;
            bodyId: z.ZodNumber;
            eyesId: z.ZodNumber;
            lipsId: z.ZodNumber;
            paletteId: z.ZodNumber;
            makeupId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        }, {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        characterId: number;
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        };
    }, {
        rageId: number;
        characterId: number;
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.save_customization";
    payload: {
        rageId: number;
        characterId: number;
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        };
    };
}, {
    type: "player.save_customization";
    payload: {
        rageId: number;
        characterId: number;
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        };
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
        characterId: number;
        accountId: number;
    }, {
        rageId: number;
        characterId: number;
        accountId: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.load_character";
    payload: {
        rageId: number;
        characterId: number;
        accountId: number;
    };
}, {
    type: "player.load_character";
    payload: {
        rageId: number;
        characterId: number;
        accountId: number;
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
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
    }, {
        characterId: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.save_character";
    payload: {
        characterId: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
    };
}, {
    type: "player.save_character";
    payload: {
        characterId: number;
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"player.create_character">;
    payload: z.ZodObject<{
        firstname: z.ZodString;
        lastname: z.ZodString;
        gender: z.ZodEnum<["MALE", "FEMALE"]>;
    } & {
        rageId: z.ZodNumber;
        accountId: z.ZodNumber;
        accountLogin: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        firstname: string;
        lastname: string;
        gender: "MALE" | "FEMALE";
        accountId: number;
        accountLogin: string;
    }, {
        rageId: number;
        firstname: string;
        lastname: string;
        gender: "MALE" | "FEMALE";
        accountId: number;
        accountLogin: string;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.create_character";
    payload: {
        rageId: number;
        firstname: string;
        lastname: string;
        gender: "MALE" | "FEMALE";
        accountId: number;
        accountLogin: string;
    };
}, {
    type: "player.create_character";
    payload: {
        rageId: number;
        firstname: string;
        lastname: string;
        gender: "MALE" | "FEMALE";
        accountId: number;
        accountLogin: string;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"player.save_customization">;
    payload: z.ZodObject<{
        rageId: z.ZodNumber;
        characterId: z.ZodNumber;
        appearance: z.ZodObject<{
            hairId: z.ZodNumber;
            beardId: z.ZodNumber;
            eyebrowsId: z.ZodNumber;
            bodyId: z.ZodNumber;
            eyesId: z.ZodNumber;
            lipsId: z.ZodNumber;
            paletteId: z.ZodNumber;
            makeupId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        }, {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        rageId: number;
        characterId: number;
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        };
    }, {
        rageId: number;
        characterId: number;
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    type: "player.save_customization";
    payload: {
        rageId: number;
        characterId: number;
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        };
    };
}, {
    type: "player.save_customization";
    payload: {
        rageId: number;
        characterId: number;
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        };
    };
}>]>;
export type PlayerCommand = z.infer<typeof PlayerCommand>;
export type LoadCharacterCommandMsg = z.infer<typeof LoadCharacterCommand>;
export type SaveCharacterCommandMsg = z.infer<typeof SaveCharacterCommand>;
export type CreateCharacterCommandMsg = z.infer<typeof CreateCharacterCommand>;
export type SaveCustomizationCommandMsg = z.infer<typeof SaveCustomizationCommand>;
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
    gender: z.ZodEnum<["MALE", "FEMALE"]>;
    appearance: z.ZodNullable<z.ZodObject<{
        hairId: z.ZodNumber;
        beardId: z.ZodNumber;
        eyebrowsId: z.ZodNumber;
        bodyId: z.ZodNumber;
        eyesId: z.ZodNumber;
        lipsId: z.ZodNumber;
        paletteId: z.ZodNumber;
        makeupId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        hairId: number;
        beardId: number;
        eyebrowsId: number;
        bodyId: number;
        eyesId: number;
        lipsId: number;
        paletteId: number;
        makeupId: number;
    }, {
        hairId: number;
        beardId: number;
        eyebrowsId: number;
        bodyId: number;
        eyesId: number;
        lipsId: number;
        paletteId: number;
        makeupId: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    appearance: {
        hairId: number;
        beardId: number;
        eyebrowsId: number;
        bodyId: number;
        eyesId: number;
        lipsId: number;
        paletteId: number;
        makeupId: number;
    } | null;
    gender: "MALE" | "FEMALE";
    position: {
        x: number;
        y: number;
        z: number;
        heading: number;
    };
    health: number;
    armor: number;
    dimension: number;
    id: number;
    name: string;
    cash: number;
    bank: number;
}, {
    appearance: {
        hairId: number;
        beardId: number;
        eyebrowsId: number;
        bodyId: number;
        eyesId: number;
        lipsId: number;
        paletteId: number;
        makeupId: number;
    } | null;
    gender: "MALE" | "FEMALE";
    position: {
        x: number;
        y: number;
        z: number;
        heading: number;
    };
    health: number;
    armor: number;
    dimension: number;
    id: number;
    name: string;
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
        gender: z.ZodEnum<["MALE", "FEMALE"]>;
        appearance: z.ZodNullable<z.ZodObject<{
            hairId: z.ZodNumber;
            beardId: z.ZodNumber;
            eyebrowsId: z.ZodNumber;
            bodyId: z.ZodNumber;
            eyesId: z.ZodNumber;
            lipsId: z.ZodNumber;
            paletteId: z.ZodNumber;
            makeupId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        }, {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        } | null;
        gender: "MALE" | "FEMALE";
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
        id: number;
        name: string;
        cash: number;
        bank: number;
    }, {
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        } | null;
        gender: "MALE" | "FEMALE";
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
        id: number;
        name: string;
        cash: number;
        bank: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    ok: boolean;
    error?: string | undefined;
    character?: {
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        } | null;
        gender: "MALE" | "FEMALE";
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
        id: number;
        name: string;
        cash: number;
        bank: number;
    } | undefined;
}, {
    ok: boolean;
    error?: string | undefined;
    character?: {
        appearance: {
            hairId: number;
            beardId: number;
            eyebrowsId: number;
            bodyId: number;
            eyesId: number;
            lipsId: number;
            paletteId: number;
            makeupId: number;
        } | null;
        gender: "MALE" | "FEMALE";
        position: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        health: number;
        armor: number;
        dimension: number;
        id: number;
        name: string;
        cash: number;
        bank: number;
    } | undefined;
}>;
export type PlayerReply = z.infer<typeof PlayerReply>;
export declare const CreateCharacterReply: z.ZodObject<{
    ok: z.ZodBoolean;
    error: z.ZodOptional<z.ZodString>;
    characterId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    ok: boolean;
    characterId?: number | undefined;
    error?: string | undefined;
}, {
    ok: boolean;
    characterId?: number | undefined;
    error?: string | undefined;
}>;
export type CreateCharacterReply = z.infer<typeof CreateCharacterReply>;
//# sourceMappingURL=player.d.ts.map