/**
 * Shared validation schemas — single source of truth for input shapes
 * across the entire stack:
 *
 *   - backend services parse incoming Kafka commands with these
 *   - the gateway re-validates before forwarding to RAGE:MP
 *   - the CEF Vue forms run safeParse() on user input before submit
 *
 * Zero runtime deps beyond `zod`, no Node-specific APIs, ESM-only —
 * so Vite bundles it cleanly for the Chrome 80 CEF target.
 */
export * from './auth.js';
export * from './character.js';
export * from './customization.js';
//# sourceMappingURL=index.d.ts.map