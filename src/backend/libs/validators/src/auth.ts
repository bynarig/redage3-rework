import { z } from 'zod';

/** Login form rules. Match the regex on the server AND the CEF input. */
const LOGIN_REGEX = /^[A-Za-z0-9_.-]+$/;

export const LoginInput = z.object({
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
});
export type LoginInput = z.infer<typeof LoginInput>;

export const RegisterInput = LoginInput.extend({
  email: z.string().trim().email('invalid email').max(100),
});
export type RegisterInput = z.infer<typeof RegisterInput>;

/**
 * Server-side wire shape — gateway adds rageId/hwid/ip/socialClub before
 * dropping the message onto Kafka. The form layer never sees these.
 */
export const LoginWire = LoginInput.extend({
  rageId: z.number().int().nonnegative(),
  hwid: z.string().default(''),
  ip: z.string().default(''),
  socialClub: z.string().default(''),
});
export type LoginWire = z.infer<typeof LoginWire>;

export const RegisterWire = RegisterInput.extend({
  rageId: z.number().int().nonnegative(),
  hwid: z.string().default(''),
  ip: z.string().default(''),
  socialClub: z.string().default(''),
});
export type RegisterWire = z.infer<typeof RegisterWire>;

export const AccountSummary = z.object({
  id: z.number().int().positive(),
  login: z.string(),
  characters: z.array(z.number().int()),
  vipLevel: z.number().int().nonnegative(),
  donutCurrency: z.number().int().nonnegative(),
});
export type AccountSummary = z.infer<typeof AccountSummary>;

export const AuthReply = z.object({
  ok: z.boolean(),
  error: z.string().optional(),
  account: AccountSummary.optional(),
});
export type AuthReply = z.infer<typeof AuthReply>;
