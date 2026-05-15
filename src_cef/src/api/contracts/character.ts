// Mirrors @redage/contracts PlayerReply / CharacterDto.
// See note in ./auth.ts on why this is a local copy.
import { z } from 'zod'

export const PositionSchema = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
    heading: z.number(),
})

export const CharacterDtoSchema = z.object({
    id: z.number(),
    name: z.string(),
    cash: z.number(),
    bank: z.number(),
    position: PositionSchema,
    health: z.number(),
    armor: z.number(),
    dimension: z.number(),
})

export const CharacterReplySchema = z.object({
    ok: z.boolean(),
    error: z.string().optional(),
    character: CharacterDtoSchema.optional(),
})

export type CharacterDto = z.infer<typeof CharacterDtoSchema>
export type CharacterReply = z.infer<typeof CharacterReplySchema>
