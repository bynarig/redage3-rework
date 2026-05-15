import { createServer, type Server } from 'http';
import { createLogger, type Logger } from '@redage/logger';

export interface ServiceRuntimeOptions {
  name: string;
  healthPort?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export type ShutdownFn = () => Promise<void> | void;

export class ServiceRuntime {
  readonly name: string;
  readonly logger: Logger;
  private readonly shutdownFns: ShutdownFn[] = [];
  private healthy = false;
  private ready = false;
  private healthServer?: Server;

  constructor(opts: ServiceRuntimeOptions) {
    this.name = opts.name;
    this.logger = createLogger({ service: opts.name, level: opts.logLevel });
  }

  onShutdown(fn: ShutdownFn): void {
    this.shutdownFns.push(fn);
  }

  markHealthy(): void {
    this.healthy = true;
  }

  markReady(): void {
    this.ready = true;
  }

  /** Install signal handlers and start an optional HTTP health endpoint. */
  async start(opts: { healthPort?: number } = {}): Promise<void> {
    const port = opts.healthPort ?? Number(process.env.HEALTH_PORT ?? 0);
    if (port > 0) {
      this.healthServer = createServer((req, res) => {
        if (req.url === '/healthz') {
          res.writeHead(this.healthy ? 200 : 503, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ ok: this.healthy, service: this.name }));
          return;
        }
        if (req.url === '/readyz') {
          res.writeHead(this.ready ? 200 : 503, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ ok: this.ready, service: this.name }));
          return;
        }
        res.writeHead(404).end();
      });
      await new Promise<void>((resolve) => this.healthServer!.listen(port, resolve));
      this.logger.info({ port }, 'health server listening');
    }

    const stop = async (signal: NodeJS.Signals): Promise<void> => {
      this.logger.warn({ signal }, 'shutdown signal received');
      this.healthy = false;
      this.ready = false;
      // Run shutdowns in reverse registration order.
      for (let i = this.shutdownFns.length - 1; i >= 0; i--) {
        try {
          await this.shutdownFns[i]!();
        } catch (err) {
          this.logger.error({ err }, 'shutdown hook failed');
        }
      }
      if (this.healthServer) {
        await new Promise<void>((resolve) => this.healthServer!.close(() => resolve()));
      }
      this.logger.info('shutdown complete');
      process.exit(0);
    };

    process.on('SIGTERM', () => void stop('SIGTERM'));
    process.on('SIGINT', () => void stop('SIGINT'));
    process.on('unhandledRejection', (reason) => {
      this.logger.fatal({ reason }, 'unhandledRejection');
    });
    process.on('uncaughtException', (err) => {
      this.logger.fatal({ err }, 'uncaughtException');
      void stop('SIGTERM');
    });
  }
}

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`missing required env var: ${name}`);
  return v;
}

export function optionalEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}
