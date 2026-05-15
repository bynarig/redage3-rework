// RAGE:MP server-side resource entry.
//
// bin/loader.mjs scans every subdirectory of `packages/` and loads its
// `index.js` (CommonJS) or `index.mjs` (ESM). We're ESM, so this file is
// `.mjs`.
//
// All real code lives at server/gateway/ (workspace package @redage/gateway).
// Build it first with `pnpm build:gateway`, then RAGE:MP can load this shim.

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const built = path.resolve(__dirname, '../../server/gateway/dist/index.js');

if (!fs.existsSync(built)) {
  console.error(
    '[redage gateway] dist/index.js not found at',
    built,
    '\n  Run `pnpm build:gateway` (or `pnpm build:server`) before starting ragemp-server.',
  );
  // Still throw so the loader logs the failure clearly.
  throw new Error('@redage/gateway not built — see message above');
}

await import(pathToFileURL(built).href);
