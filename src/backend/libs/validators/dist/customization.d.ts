import { z } from 'zod';
export declare const Appearance: z.ZodObject<{
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
export type Appearance = z.infer<typeof Appearance>;
export declare const SaveCustomizationWire: z.ZodObject<{
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
export type SaveCustomizationWire = z.infer<typeof SaveCustomizationWire>;
export declare const DEFAULT_APPEARANCE: Appearance;
//# sourceMappingURL=customization.d.ts.map