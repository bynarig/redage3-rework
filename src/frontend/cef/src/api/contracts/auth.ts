// Mirrors @redage/validators (auth.ts). See note in ./character.ts on why
// these are local copies rather than a workspace import.
import { z } from 'zod'

const LOGIN_REGEX = /^[A-Za-z0-9_.-]+$/

export const LoginInputSchema = z.object({
    login: z
        .string()
        .trim()
        .min(3, 'login must be at least 3 chars')
        .max(50, 'login must be at most 50 chars')
        .regex(LOGIN_REGEX, 'login may contain letters, digits, _ . -'),
    password: z
        .string()
        .min(6, 'password must be at least 6 chars')
        .max(256, 'password too long'),
})
export type LoginInput = z.infer<typeof LoginInputSchema>

export const RegisterInputSchema = LoginInputSchema.extend({
    email: z.string().trim().email('invalid email').max(100),
})
export type RegisterInput = z.infer<typeof RegisterInputSchema>

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
