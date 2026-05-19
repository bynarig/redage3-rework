// Mirrors @redage/validators (backend uses zod 3, CEF uses zod 4; we keep
// mirrored schemas to avoid pulling a workspace lib with a major-version
// mismatch). A drift-protection test in __tests__/ asserts these accept the
// same inputs as the backend Zod schemas.
import { z } from 'zod'

export const PositionSchema = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
    heading: z.number(),
})

export const GenderSchema = z.enum(['MALE', 'FEMALE'])
export type Gender = z.infer<typeof GenderSchema>

export const AppearanceSchema = z.object({
    hairId: z.number().int().min(0).max(255),
    beardId: z.number().int().min(0).max(255),
    eyebrowsId: z.number().int().min(0).max(255),
    bodyId: z.number().int().min(0).max(255),
    eyesId: z.number().int().min(0).max(255),
    lipsId: z.number().int().min(0).max(255),
    paletteId: z.number().int().min(0).max(255),
    makeupId: z.number().int().min(0).max(255),
})
export type Appearance = z.infer<typeof AppearanceSchema>

export const DEFAULT_APPEARANCE: Appearance = {
    hairId: 0,
    beardId: 0,
    eyebrowsId: 0,
    bodyId: 0,
    eyesId: 0,
    lipsId: 0,
    paletteId: 0,
    makeupId: 0,
}

const NAME_REGEX = /^[A-Za-zА-Яа-яЁё]+$/
const NameField = z
    .string()
    .trim()
    .min(2, 'must be at least 2 chars')
    .max(50, 'must be at most 50 chars')
    .regex(NAME_REGEX, 'letters only — no digits, spaces, or punctuation')

export const CreateCharacterInputSchema = z.object({
    firstname: NameField,
    lastname: NameField,
    gender: GenderSchema,
})
export type CreateCharacterInput = z.infer<typeof CreateCharacterInputSchema>

export const CharacterDtoSchema = z.object({
    id: z.number(),
    name: z.string(),
    cash: z.number(),
    bank: z.number(),
    position: PositionSchema,
    health: z.number(),
    armor: z.number(),
    dimension: z.number(),
    gender: GenderSchema,
    appearance: AppearanceSchema.nullable(),
})

export const CharacterReplySchema = z.object({
    ok: z.boolean(),
    error: z.string().optional(),
    character: CharacterDtoSchema.optional(),
})

export const CreateCharacterReplySchema = z.object({
    ok: z.boolean(),
    error: z.string().optional(),
    characterId: z.number().optional(),
})

export const CustomizationReplySchema = z.object({
    ok: z.boolean(),
    error: z.string().optional(),
})

export type CharacterDto = z.infer<typeof CharacterDtoSchema>
export type CharacterReply = z.infer<typeof CharacterReplySchema>
export type CreateCharacterReply = z.infer<typeof CreateCharacterReplySchema>
export type CustomizationReply = z.infer<typeof CustomizationReplySchema>
