export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
export type LogMethod = (arg?: unknown, message?: string, ...extra: unknown[]) => void;
export interface Logger {
    fatal: LogMethod;
    error: LogMethod;
    warn: LogMethod;
    info: LogMethod;
    debug: LogMethod;
    trace: LogMethod;
    child(bindings: Record<string, unknown>): Logger;
}
export interface CreateLoggerOptions {
    service: string;
    level?: LogLevel;
    pretty?: boolean;
}
export declare function createLogger(opts: CreateLoggerOptions): Logger;
//# sourceMappingURL=index.d.ts.map