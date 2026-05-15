// Mirrors @redage/contracts AuthReply. Kept as a small local copy so CEF
// doesn't need to depend on the server workspace (different TS target /
// Chrome 80 browserlist). Keep these definitions aligned manually — they
// are the wire format between server-side gateway and CEF UI.
import { z } from 'zod'

export const AccountSummarySchema = z.object({
    id: z.number(),
    login: z.string(),
    characters: z.array(z.number()),
    vipLevel: z.number(),
    donutCurrency: z.number(),
})

export const AuthReplySchema = z.object({
    ok: z.boolean(),
    error: z.string().optional(),
    account: AccountSummarySchema.optional(),
})

export type AccountSummary = z.infer<typeof AccountSummarySchema>
export type AuthReply = z.infer<typeof AuthReplySchema>
