import { z } from 'zod';
export declare const LoginInput: z.ZodObject<{
    login: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    login: string;
    password: string;
}, {
    login: string;
    password: string;
}>;
export type LoginInput = z.infer<typeof LoginInput>;
export declare const RegisterInput: z.ZodObject<{
    login: z.ZodString;
    password: z.ZodString;
} & {
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    login: string;
    password: string;
    email: string;
}, {
    login: string;
    password: string;
    email: string;
}>;
export type RegisterInput = z.infer<typeof RegisterInput>;
/**
 * Server-side wire shape — gateway adds rageId/hwid/ip/socialClub before
 * dropping the message onto Kafka. The form layer never sees these.
 */
export declare const LoginWire: z.ZodObject<{
    login: z.ZodString;
    password: z.ZodString;
} & {
    rageId: z.ZodNumber;
    hwid: z.ZodDefault<z.ZodString>;
    ip: z.ZodDefault<z.ZodString>;
    socialClub: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    rageId: number;
    login: string;
    password: string;
    hwid: string;
    ip: string;
    socialClub: string;
}, {
    rageId: number;
    login: string;
    password: string;
    hwid?: string | undefined;
    ip?: string | undefined;
    socialClub?: string | undefined;
}>;
export type LoginWire = z.infer<typeof LoginWire>;
export declare const RegisterWire: z.ZodObject<{
    login: z.ZodString;
    password: z.ZodString;
} & {
    email: z.ZodString;
} & {
    rageId: z.ZodNumber;
    hwid: z.ZodDefault<z.ZodString>;
    ip: z.ZodDefault<z.ZodString>;
    socialClub: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    rageId: number;
    login: string;
    password: string;
    email: string;
    hwid: string;
    ip: string;
    socialClub: string;
}, {
    rageId: number;
    login: string;
    password: string;
    email: string;
    hwid?: string | undefined;
    ip?: string | undefined;
    socialClub?: string | undefined;
}>;
export type RegisterWire = z.infer<typeof RegisterWire>;
export declare const AccountSummary: z.ZodObject<{
    id: z.ZodNumber;
    login: z.ZodString;
    characters: z.ZodArray<z.ZodNumber, "many">;
    vipLevel: z.ZodNumber;
    donutCurrency: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    login: string;
    characters: number[];
    vipLevel: number;
    donutCurrency: number;
}, {
    id: number;
    login: string;
    characters: number[];
    vipLevel: number;
    donutCurrency: number;
}>;
export type AccountSummary = z.infer<typeof AccountSummary>;
export declare const AuthReply: z.ZodObject<{
    ok: z.ZodBoolean;
    error: z.ZodOptional<z.ZodString>;
    account: z.ZodOptional<z.ZodObject<{
        id: z.ZodNumber;
        login: z.ZodString;
        characters: z.ZodArray<z.ZodNumber, "many">;
        vipLevel: z.ZodNumber;
        donutCurrency: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: number;
        login: string;
        characters: number[];
        vipLevel: number;
        donutCurrency: number;
    }, {
        id: number;
        login: string;
        characters: number[];
        vipLevel: number;
        donutCurrency: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    ok: boolean;
    error?: string | undefined;
    account?: {
        id: number;
        login: string;
        characters: number[];
        vipLevel: number;
        donutCurrency: number;
    } | undefined;
}, {
    ok: boolean;
    error?: string | undefined;
    account?: {
        id: number;
        login: string;
        characters: number[];
        vipLevel: number;
        donutCurrency: number;
    } | undefined;
}>;
export type AuthReply = z.infer<typeof AuthReply>;
//# sourceMappingURL=auth.d.ts.map