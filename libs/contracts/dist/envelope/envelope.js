import crypto from 'crypto';
import { z } from 'zod';
export function createUuid() {
    if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    const bytes = crypto.randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = bytes.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
/**
 * Every message on Kafka is wrapped in this envelope.
 * Lets us route, trace, version, and dedupe uniformly across services.
 */
export const envelopeSchema = z.object({
    id: z.string().uuid(),
    type: z.string().min(1),
    version: z.number().int().positive().default(1),
    occurredAt: z.string().datetime(),
    source: z.string().min(1),
    correlationId: z.string().uuid().optional(),
    causationId: z.string().uuid().optional(),
    replyTo: z.string().optional(),
    payload: z.unknown(),
});
export function buildEnvelope(input) {
    return {
        id: createUuid(),
        type: input.type,
        version: input.version ?? 1,
        occurredAt: new Date().toISOString(),
        source: input.source,
        correlationId: input.correlationId,
        causationId: input.causationId,
        replyTo: input.replyTo,
        payload: input.payload,
    };
}
//# sourceMappingURL=envelope.js.map