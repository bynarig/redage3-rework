import { z } from 'zod';
export declare const LoginCommand: z.ZodObject<{
    type: z.ZodLiteral<"auth.login">;
    payload: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    type: "auth.login";
    payload: {
        rageId: number;
        login: string;
        password: string;
        hwid: string;
        ip: string;
        socialClub: string;
    };
}, {
    type: "auth.login";
    payload: {
        rageId: number;
        login: string;
        password: string;
        hwid?: string | undefined;
        ip?: string | undefined;
        socialClub?: string | undefined;
    };
}>;
export declare const RegisterCommand: z.ZodObject<{
    type: z.ZodLiteral<"auth.register">;
    payload: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    type: "auth.register";
    payload: {
        rageId: number;
        login: string;
        password: string;
        email: string;
        hwid: string;
        ip: string;
        socialClub: string;
    };
}, {
    type: "auth.register";
    payload: {
        rageId: number;
        login: string;
        password: string;
        email: string;
        hwid?: string | undefined;
        ip?: string | undefined;
        socialClub?: string | undefined;
    };
}>;
export declare const AuthCommand: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"auth.login">;
    payload: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    type: "auth.login";
    payload: {
        rageId: number;
        login: string;
        password: string;
        hwid: string;
        ip: string;
        socialClub: string;
    };
}, {
    type: "auth.login";
    payload: {
        rageId: number;
        login: string;
        password: string;
        hwid?: string | undefined;
        ip?: string | undefined;
        socialClub?: string | undefined;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"auth.register">;
    payload: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    type: "auth.register";
    payload: {
        rageId: number;
        login: string;
        password: string;
        email: string;
        hwid: string;
        ip: string;
        socialClub: string;
    };
}, {
    type: "auth.register";
    payload: {
        rageId: number;
        login: string;
        password: string;
        email: string;
        hwid?: string | undefined;
        ip?: string | undefined;
        socialClub?: string | undefined;
    };
}>]>;
export type AuthCommand = z.infer<typeof AuthCommand>;
export type LoginCommandMsg = z.infer<typeof LoginCommand>;
export type RegisterCommandMsg = z.infer<typeof RegisterCommand>;
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