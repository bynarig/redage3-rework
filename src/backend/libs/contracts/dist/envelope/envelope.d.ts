import { z } from 'zod';
export declare function createUuid(): string;
/**
 * Every message on Kafka is wrapped in this envelope.
 * Lets us route, trace, version, and dedupe uniformly across services.
 */
export declare const envelopeSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    version: z.ZodDefault<z.ZodNumber>;
    occurredAt: z.ZodString;
    source: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
    causationId: z.ZodOptional<z.ZodString>;
    replyTo: z.ZodOptional<z.ZodString>;
    payload: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: string;
    version: number;
    occurredAt: string;
    source: string;
    correlationId?: string | undefined;
    causationId?: string | undefined;
    replyTo?: string | undefined;
    payload?: unknown;
}, {
    id: string;
    type: string;
    occurredAt: string;
    source: string;
    version?: number | undefined;
    correlationId?: string | undefined;
    causationId?: string | undefined;
    replyTo?: string | undefined;
    payload?: unknown;
}>;
export type Envelope<T = unknown> = Omit<z.infer<typeof envelopeSchema>, 'payload'> & {
    payload: T;
};
export declare function buildEnvelope<T>(input: {
    type: string;
    source: string;
    payload: T;
    correlationId?: string;
    causationId?: string;
    replyTo?: string;
    version?: number;
}): Envelope<T>;
//# sourceMappingURL=envelope.d.ts.map