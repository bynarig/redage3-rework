import { z } from 'zod';
export declare const Gender: z.ZodEnum<["MALE", "FEMALE"]>;
export type Gender = z.infer<typeof Gender>;
export declare const CreateCharacterInput: z.ZodObject<{
    firstname: z.ZodString;
    lastname: z.ZodString;
    gender: z.ZodEnum<["MALE", "FEMALE"]>;
}, "strip", z.ZodTypeAny, {
    firstname: string;
    lastname: string;
    gender: "MALE" | "FEMALE";
}, {
    firstname: string;
    lastname: string;
    gender: "MALE" | "FEMALE";
}>;
export type CreateCharacterInput = z.infer<typeof CreateCharacterInput>;
export declare const CreateCharacterWire: z.ZodObject<{
    firstname: z.ZodString;
    lastname: z.ZodString;
    gender: z.ZodEnum<["MALE", "FEMALE"]>;
} & {
    rageId: z.ZodNumber;
    accountId: z.ZodNumber;
    /**
     * Account login — the unique handle. player-service looks the full account
     * row up by this to populate the account_characters link table.
     * Filled by the gateway from session state, never trusted from the UI.
     */
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
export type CreateCharacterWire = z.infer<typeof CreateCharacterWire>;
export declare const PositionVec: z.ZodObject<{
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
export type PositionVec = z.infer<typeof PositionVec>;
export declare const SaveCharacterWire: z.ZodObject<{
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
export type SaveCharacterWire = z.infer<typeof SaveCharacterWire>;
export declare const LoadCharacterWire: z.ZodObject<{
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
export type LoadCharacterWire = z.infer<typeof LoadCharacterWire>;
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
    /**
     * Customization is bundled with the character on load so the gateway
     * can apply appearance in a single hop. May be null for legacy chars
     * created before the customization wizard shipped.
     */
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
export declare const CharacterReply: z.ZodObject<{
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
        /**
         * Customization is bundled with the character on load so the gateway
         * can apply appearance in a single hop. May be null for legacy chars
         * created before the customization wizard shipped.
         */
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
export type CharacterReply = z.infer<typeof CharacterReply>;
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
//# sourceMappingURL=character.d.ts.map