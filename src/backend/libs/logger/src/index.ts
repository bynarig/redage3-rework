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

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};

const REDACTED_KEYS = new Set(['password', 'hwid']);

function normalizeLevel(value: unknown): LogLevel {
  if (value === 'fatal' || value === 'error' || value === 'warn' || value === 'info' || value === 'debug' || value === 'trace') {
    return value;
  }

  return 'info';
}

function normalizeError(error: Error): Record<string, unknown> {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}

function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 8) return '[depth-limit]';
  if (value instanceof Error) return normalizeError(value);
  if (Array.isArray(value)) return value.map((item) => sanitize(item, depth + 1));

  if (value !== null && typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      output[key] = REDACTED_KEYS.has(key.toLowerCase()) ? '[redacted]' : sanitize(nested, depth + 1);
    }
    return output;
  }

  return value;
}

function stringify(record: Record<string, unknown>): string {
  try {
    return JSON.stringify(record);
  } catch {
    return JSON.stringify({
      level: record.level,
      time: record.time,
      service: record.service,
      message: record.message,
      serializationError: true,
    });
  }
}

function createMethod(
  level: LogLevel,
  threshold: LogLevel,
  bindings: Record<string, unknown>,
): LogMethod {
  return (arg?: unknown, message?: string, ...extra: unknown[]) => {
    if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[threshold]) return;

    const isMessageOnly = typeof arg === 'string' && message === undefined;
    const record: Record<string, unknown> = {
      level,
      time: new Date().toISOString(),
      ...bindings,
      message: isMessageOnly ? arg : message,
    };

    if (!isMessageOnly && arg !== undefined) {
      record.data = sanitize(arg);
    }

    if (extra.length > 0) {
      record.extra = sanitize(extra);
    }

    const line = stringify(record);
    if (level === 'fatal' || level === 'error') console.error(line);
    else if (level === 'warn') console.warn(line);
    else console.log(line);
  };
}

function createBoundLogger(level: LogLevel, bindings: Record<string, unknown>): Logger {
  return {
    fatal: createMethod('fatal', level, bindings),
    error: createMethod('error', level, bindings),
    warn: createMethod('warn', level, bindings),
    info: createMethod('info', level, bindings),
    debug: createMethod('debug', level, bindings),
    trace: createMethod('trace', level, bindings),
    child(childBindings: Record<string, unknown>): Logger {
      return createBoundLogger(level, { ...bindings, ...sanitize(childBindings) as Record<string, unknown> });
    },
  };
}

export function createLogger(opts: CreateLoggerOptions): Logger {
  const level = normalizeLevel(opts.level ?? process.env.LOG_LEVEL);
  return createBoundLogger(level, { service: opts.service });
}
