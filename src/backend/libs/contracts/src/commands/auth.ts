import { z } from 'zod';
import { LoginWire, RegisterWire, AuthReply as AuthReplyShared } from '@redage/validators';

export const LoginCommand = z.object({
  type: z.literal('auth.login'),
  payload: LoginWire,
});

export const RegisterCommand = z.object({
  type: z.literal('auth.register'),
  payload: RegisterWire,
});

export const AuthCommand = z.discriminatedUnion('type', [LoginCommand, RegisterCommand]);
export type AuthCommand = z.infer<typeof AuthCommand>;
export type LoginCommandMsg = z.infer<typeof LoginCommand>;
export type RegisterCommandMsg = z.infer<typeof RegisterCommand>;

export const AuthReply = AuthReplyShared;
export type AuthReply = z.infer<typeof AuthReply>;
