import { type Logger } from '@redage/logger';
export interface ServiceRuntimeOptions {
    name: string;
    healthPort?: number;
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
}
export type ShutdownFn = () => Promise<void> | void;
export declare class ServiceRuntime {
    readonly name: string;
    readonly logger: Logger;
    private readonly shutdownFns;
    private healthy;
    private ready;
    private healthServer?;
    constructor(opts: ServiceRuntimeOptions);
    onShutdown(fn: ShutdownFn): void;
    markHealthy(): void;
    markReady(): void;
    /** Install signal handlers and start an optional HTTP health endpoint. */
    start(opts?: {
        healthPort?: number;
    }): Promise<void>;
}
export declare function requireEnv(name: string): string;
export declare function optionalEnv(name: string, fallback: string): string;
//# sourceMappingURL=index.d.ts.map