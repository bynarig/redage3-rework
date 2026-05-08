import { z } from 'zod'

export const AuctionLotSchema = z.object({
    id: z.number(),
    title: z.string(),
    text: z.string(),
    betCount: z.number(),
    createPrice: z.number(),
    lastPrice: z.number(),
    time: z.string(),
    createName: z.string().optional(),
})

export const AuctionListSchema = z.array(AuctionLotSchema)

export type AuctionLot = z.infer<typeof AuctionLotSchema>

export const AUCTION_CATEGORIES = ['Транспорт', 'Недвижимость', 'Бизнес', 'Другое'] as const
