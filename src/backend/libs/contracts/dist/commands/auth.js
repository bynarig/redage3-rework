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
export const AuthReply = AuthReplyShared;
//# sourceMappingURL=auth.js.map