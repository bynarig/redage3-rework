const LEVEL_WEIGHT = {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10,
};
const REDACTED_KEYS = new Set(['password', 'hwid']);
function normalizeLevel(value) {
    if (value === 'fatal' || value === 'error' || value === 'warn' || value === 'info' || value === 'debug' || value === 'trace') {
        return value;
    }
    return 'info';
}
function normalizeError(error) {
    return {
        name: error.name,
        message: error.message,
        stack: error.stack,
    };
}
function sanitize(value, depth = 0) {
    if (depth > 8)
        return '[depth-limit]';
    if (value instanceof Error)
        return normalizeError(value);
    if (Array.isArray(value))
        return value.map((item) => sanitize(item, depth + 1));
    if (value !== null && typeof value === 'object') {
        const output = {};
        for (const [key, nested] of Object.entries(value)) {
            output[key] = REDACTED_KEYS.has(key.toLowerCase()) ? '[redacted]' : sanitize(nested, depth + 1);
        }
        return output;
    }
    return value;
}
function stringify(record) {
    try {
        return JSON.stringify(record);
    }
    catch {
        return JSON.stringify({
            level: record.level,
            time: record.time,
            service: record.service,
            message: record.message,
            serializationError: true,
        });
    }
}
function createMethod(level, threshold, bindings) {
    return (arg, message, ...extra) => {
        if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[threshold])
            return;
        const isMessageOnly = typeof arg === 'string' && message === undefined;
        const record = {
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
        if (level === 'fatal' || level === 'error')
            console.error(line);
        else if (level === 'warn')
            console.warn(line);
        else
            console.log(line);
    };
}
function createBoundLogger(level, bindings) {
    return {
        fatal: createMethod('fatal', level, bindings),
        error: createMethod('error', level, bindings),
        warn: createMethod('warn', level, bindings),
        info: createMethod('info', level, bindings),
        debug: createMethod('debug', level, bindings),
        trace: createMethod('trace', level, bindings),
        child(childBindings) {
            return createBoundLogger(level, { ...bindings, ...sanitize(childBindings) });
        },
    };
}
export function createLogger(opts) {
    const level = normalizeLevel(opts.level ?? process.env.LOG_LEVEL);
    return createBoundLogger(level, { service: opts.service });
}
//# sourceMappingURL=index.js.map