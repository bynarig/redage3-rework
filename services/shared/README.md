# @redage/shared

Shared runtime for all services: Prisma client, position serializers, anything
else that genuinely belongs to *every* service.

The generated Prisma client lives at `prisma/` inside this package (target of
`database/prisma/schema.prisma`). Regenerate with:

```bash
pnpm --filter @redage/shared generate
# or from the repo root, the existing alias:
pnpm prisma:generate
```

## Why a workspace package, not a folder copy

A single generated client + a single import (`@redage/shared`) means:
- One connection pool per service (already what we want — each service is its own process).
- One place to swap to a different ORM if we ever do.
- Zod/runtime helpers like `parsePosition` live alongside the types they're paired with.

If you need fresh types after a schema change: `pnpm prisma:generate && pnpm build --filter @redage/shared`.
