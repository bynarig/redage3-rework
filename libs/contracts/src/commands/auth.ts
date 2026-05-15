import { z } from 'zod';

export const LoginCommand = z.object({
  type: z.literal('auth.login'),
  payload: z.object({
    rageId: z.number().int().nonnegative(),
    login: z.string().min(3).max(50),
    password: z.string().min(6).max(256),
    hwid: z.string().default(''),
    ip: z.string().default(''),
    socialClub: z.string().default(''),
  }),
});

export const RegisterCommand = z.object({
  type: z.literal('auth.register'),
  payload: z.object({
    rageId: z.number().int().nonnegative(),
    login: z.string().min(3).max(50),
    email: z.string().email().max(100),
    password: z.string().min(6).max(256),
    hwid: z.string().default(''),
    ip: z.string().default(''),
    socialClub: z.string().default(''),
  }),
});

export const AuthCommand = z.discriminatedUnion('type', [LoginCommand, RegisterCommand]);
export type AuthCommand = z.infer<typeof AuthCommand>;
export type LoginCommandMsg = z.infer<typeof LoginCommand>;
export type RegisterCommandMsg = z.infer<typeof RegisterCommand>;

export const AuthReply = z.object({
  ok: z.boolean(),
  error: z.string().optional(),
  account: z
    .object({
      id: z.number().int().positive(),
      login: z.string(),
      characters: z.array(z.number().int()),
      vipLevel: z.number().int().nonnegative(),
      donutCurrency: z.number().int().nonnegative(),
    })
    .optional(),
});
export type AuthReply = z.infer<typeof AuthReply>;
