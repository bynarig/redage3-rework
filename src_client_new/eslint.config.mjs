// @ts-check
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    ignores: ['node_modules/**', 'dist/**', 'webpack.config.js'],
  },

  // ─── RAGE MP client-side limits ─────────────────────────────────────────────
  // RAGE MP client-side scripts run in an embedded V8 context inside GTA V.
  // There is NO browser, NO DOM, NO network stack — only the RAGE MP API (mp.*),
  // the gamemode API (gm.*), the global namespace, and whatever webpack bundles.
  {
    name: 'ragemp/client-limits',
    files: ['**/*.ts'],
    rules: {
      // ── Forbidden browser globals ──────────────────────────────────────────
      'no-restricted-globals': [
        'error',
        {
          name: 'window',
          message:
            'window does not exist in RAGE MP client-side context. ' +
            'Use global.* for shared state and mp.gui.emmit() to talk to CEF.',
        },
        {
          name: 'document',
          message: 'document does not exist in RAGE MP client-side context.',
        },
        {
          name: 'navigator',
          message: 'navigator does not exist in RAGE MP client-side context.',
        },
        {
          name: 'location',
          message: 'location does not exist in RAGE MP client-side context.',
        },
        {
          name: 'localStorage',
          message:
            'localStorage does not exist in RAGE MP client-side context. ' +
            'Use server-side persistence via mp.events.callRemote().',
        },
        {
          name: 'sessionStorage',
          message: 'sessionStorage does not exist in RAGE MP client-side context.',
        },
        {
          name: 'alert',
          message: 'alert does not exist in RAGE MP client-side context.',
        },
        {
          name: 'confirm',
          message: 'confirm does not exist in RAGE MP client-side context.',
        },
        {
          name: 'prompt',
          message: 'prompt does not exist in RAGE MP client-side context.',
        },

        // ── Forbidden Node.js globals ────────────────────────────────────────
        // webpack injects process.env.NODE_ENV at build time, but the real
        // process object does not exist at runtime in the RAGE MP V8 sandbox.
        {
          name: 'process',
          message:
            'process is a Node.js global — not available in RAGE MP V8 client context. ' +
            'webpack replaces process.env.NODE_ENV at build time, but runtime access will throw.',
        },
        {
          name: 'Buffer',
          message: 'Buffer is a Node.js global — not available in RAGE MP V8 client context.',
        },
        {
          name: '__dirname',
          message: '__dirname is a Node.js global — not available in RAGE MP V8 client context.',
        },
        {
          name: '__filename',
          message: '__filename is a Node.js global — not available in RAGE MP V8 client context.',
        },
        {
          name: 'setImmediate',
          message:
            'setImmediate is a Node.js global — not available in RAGE MP V8 client context. ' +
            'Use setTimeout(fn, 0) or mp.events for deferred execution.',
        },
        {
          name: 'clearImmediate',
          message: 'clearImmediate is a Node.js global — not available in RAGE MP V8 client context.',
        },
        {
          name: 'require',
          message:
            'require() is a Node.js module function — not available in RAGE MP V8 client context. ' +
            'webpack bundles all imports at build time; use ES module imports instead.',
        },
      ],

      // ── Forbidden browser APIs ─────────────────────────────────────────────
      'no-restricted-syntax': [
        'error',
        {
          // No fetch() — RAGE MP client has no HTTP stack
          selector: "CallExpression[callee.name='fetch']",
          message:
            'fetch() is not available in RAGE MP client-side context. ' +
            'Call the server via mp.events.callRemote() or use rage-rpc.',
        },
        {
          // No XMLHttpRequest
          selector: "NewExpression[callee.name='XMLHttpRequest']",
          message: 'XMLHttpRequest is not available in RAGE MP client-side context.',
        },
        {
          // No WebSocket (not available in RAGE MP V8)
          selector: "NewExpression[callee.name='WebSocket']",
          message:
            'WebSocket is not available in RAGE MP client-side context. ' +
            'Use mp.events for client↔server communication.',
        },
        {
          // Catch accidental DOM manipulation
          selector:
            "CallExpression[callee.object.name='document']",
          message:
            'document.* APIs are not available in RAGE MP client-side context.',
        },
      ],

      // ── Forbidden Node.js module imports ──────────────────────────────────
      // RAGE MP V8 client context has no module resolver — only what webpack
      // bundles from the project. Node.js built-in modules are never available
      // at runtime, even if webpack can resolve them at build time.
      'no-restricted-imports': [
        'error',
        { name: 'fs', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:fs', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'path', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:path', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'os', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:os', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'http', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:http', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'https', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:https', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'net', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:net', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'crypto', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:crypto', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'child_process', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:child_process', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'cluster', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:cluster', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'dns', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:dns', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'events', message: 'Node.js built-in — not available in RAGE MP V8 client context. Use mp.events for event handling.' },
        { name: 'node:events', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'readline', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:readline', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'stream', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:stream', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'url', message: 'Node.js built-in — not available in RAGE MP V8 client context. Use the URL constructor (web standard) if needed.' },
        { name: 'node:url', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'util', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:util', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'worker_threads', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:worker_threads', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'vm', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:vm', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'tls', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:tls', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'zlib', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:zlib', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'querystring', message: 'Node.js built-in — not available in RAGE MP V8 client context. Use URLSearchParams (web standard) instead.' },
        { name: 'node:querystring', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'buffer', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:buffer', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'assert', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:assert', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'perf_hooks', message: 'Node.js built-in — not available in RAGE MP V8 client context. Use performance.now() if available.' },
        { name: 'node:perf_hooks', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'timers', message: 'Node.js built-in — not available in RAGE MP V8 client context. Use setTimeout/setInterval directly.' },
        { name: 'node:timers', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'module', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:module', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'process', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
        { name: 'node:process', message: 'Node.js built-in — not available in RAGE MP V8 client context.' },
      ],

      // ── TypeScript rules suited to RAGE MP scripting ───────────────────────
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      // RAGE MP callbacks often have unused params (e.g. event handlers)
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // ────────────────────────────────────────────────────────────────────────────

  // ─── Class-only architecture ─────────────────────────────────────────────────
  // All business logic must live inside classes. Standalone function declarations
  // and arrow-function exports create implicit shared state, bypass TypeScript's
  // access modifiers, and make dependency tracing harder in a large client codebase.
  //
  // Allowed:  class declarations, `new ClassName()` singletons, class fields,
  //           arrow functions used as *arguments* (e.g. mp.events.add callbacks),
  //           arrow functions inside class methods.
  // Banned:   top-level `function foo()`, exported `function foo()`,
  //           exported `const foo = () => {}` / `const foo = function() {}`.
  {
    name: 'ragemp/class-only-architecture',
    files: ['**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',

        // ── Top-level function declarations ────────────────────────────────
        {
          selector: 'Program > FunctionDeclaration',
          message:
            'Top-level function declarations are not allowed. ' +
            'Move this logic into a class method.',
        },

        // ── Exported function declarations ─────────────────────────────────
        {
          selector: 'ExportNamedDeclaration > FunctionDeclaration',
          message:
            'Exporting standalone functions is not allowed. ' +
            'Export a class or a class instance (singleton) instead.',
        },
        {
          selector: 'ExportDefaultDeclaration > FunctionDeclaration',
          message:
            'Exporting standalone functions is not allowed. ' +
            'Export a class or a class instance (singleton) instead.',
        },

        // ── Exported arrow / function-expression variables ─────────────────
        {
          selector:
            'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[init.type="ArrowFunctionExpression"]',
          message:
            'Exporting arrow functions is not allowed. ' +
            'Export a class or a class instance (singleton) instead.',
        },
        {
          selector:
            'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[init.type="FunctionExpression"]',
          message:
            'Exporting function expressions is not allowed. ' +
            'Export a class or a class instance (singleton) instead.',
        },
        {
          selector: 'ExportDefaultDeclaration > ArrowFunctionExpression',
          message:
            'Exporting arrow functions is not allowed. ' +
            'Export a class or a class instance (singleton) instead.',
        },

        // ── Top-level arrow / function-expression variables ────────────────
        // Catches `const helper = () => {}` at module scope (non-exported).
        {
          selector:
            'Program > VariableDeclaration > VariableDeclarator[init.type="ArrowFunctionExpression"]',
          message:
            'Top-level arrow function variables are not allowed. ' +
            'Move this logic into a class method or a private static method.',
        },
        {
          selector:
            'Program > VariableDeclaration > VariableDeclarator[init.type="FunctionExpression"]',
          message:
            'Top-level function expressions are not allowed. ' +
            'Move this logic into a class method or a private static method.',
        },
      ],
    },
  },
  // ────────────────────────────────────────────────────────────────────────────
)
