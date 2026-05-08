import { z } from 'zod'

const ForbesAssetSchema = z.object({
    Name: z.string(),
    Money: z.number(),
})

export const ForbesItemSchema = z.object({
    Name: z.string(),
    Money: z.number(),
    Lvl: z.number().optional(),
    IsShowForbes: z.boolean().optional(),
    houses: z.array(ForbesAssetSchema).optional(),
    biz: z.array(ForbesAssetSchema).optional(),
    vehicles: z.array(ForbesAssetSchema).optional(),
})

export const ForbesListSchema = z.array(ForbesItemSchema)

export type ForbesAsset = z.infer<typeof ForbesAssetSchema>
export type ForbesItem = z.infer<typeof ForbesItemSchema>
