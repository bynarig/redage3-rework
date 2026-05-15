# RAGE:MP resource: gateway

This directory is loaded by `bin/loader.mjs` (RAGE:MP's package autoloader).
The `index.mjs` here is a thin shim — the real implementation lives in
`server/gateway/` as the `@redage/gateway` workspace package.

**Build before starting the server:**

```bash
pnpm build:server   # builds libs/*, services/shared, services/*, and server/gateway
```

If you only changed the gateway:

```bash
pnpm build:gateway
```

Do not add code to this directory. It exists solely to satisfy RAGE:MP's
resource layout.
