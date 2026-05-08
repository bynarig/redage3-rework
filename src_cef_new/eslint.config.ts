import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,


  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  // ─── RAGE MP CEF compatibility limits ───────────────────────────────────────
  // RAGE MP loads CEF pages via file:// from the client_packages folder.
  // The embedded Chromium is ~v80 and the page has no server context, so several
  // common web patterns are either broken or unavailable.
  {
    name: 'ragemp/cef-limits',
    files: ['src/**/*.{vue,ts,mts,tsx}'],
    rules: {
      // Node.js globals are not injected into the CEF renderer process
      'no-restricted-globals': [
        'error',
        {
          name: 'process',
          message: 'process is a Node.js global — not available in RAGE MP CEF. Use import.meta.env instead.',
        },
        {
          name: '__dirname',
          message: '__dirname is a Node.js global — not available in RAGE MP CEF.',
        },
        {
          name: '__filename',
          message: '__filename is a Node.js global — not available in RAGE MP CEF.',
        },
      ],

      'no-restricted-properties': [
        'error',
        // HTML5 pushState history breaks under file:// — use hash routing
        {
          object: 'window',
          property: 'history',
          message:
            'window.history (pushState) does not work with file:// protocol in RAGE MP CEF. ' +
            'Vue Router is already configured with createWebHashHistory.',
        },
        {
          object: 'history',
          property: 'pushState',
          message: 'pushState does not work under file:// in RAGE MP CEF. Use hash routing.',
        },
        {
          object: 'history',
          property: 'replaceState',
          message: 'replaceState does not work under file:// in RAGE MP CEF. Use hash routing.',
        },
        // localStorage persists across sessions but is wiped on RAGE MP resource
        // restart; use the RAGE MP event bridge to read persistent data instead.
        {
          object: 'localStorage',
          message:
            'localStorage is cleared on CEF reload/resource restart. ' +
            'Persist data server-side and fetch it via the RAGE MP event bridge.',
        },
        {
          object: 'window',
          property: 'localStorage',
          message:
            'localStorage is cleared on CEF reload/resource restart. ' +
            'Persist data server-side and fetch it via the RAGE MP event bridge.',
        },
        {
          object: 'sessionStorage',
          message: 'sessionStorage is reset on every CEF page load. Use reactive Pinia stores instead.',
        },
        {
          object: 'window',
          property: 'sessionStorage',
          message: 'sessionStorage is reset on every CEF page load. Use reactive Pinia stores instead.',
        },
      ],

      'no-restricted-syntax': [
        'error',
        // fetch() works in Chrome 80 but RAGE MP CEF has no network access to
        // external URLs by default; all game data must come via mp.trigger/emit.
        {
          selector: "CallExpression[callee.name='fetch']",
          message:
            'fetch() has no network access in RAGE MP CEF. ' +
            'Receive data from the client script via mp.trigger() / the RAGE MP event bridge.',
        },
        {
          selector: "NewExpression[callee.name='XMLHttpRequest']",
          message: 'XMLHttpRequest has no network access in RAGE MP CEF. Use the RAGE MP event bridge.',
        },
        // Assigning window.location redirects away from the CEF page
        {
          selector:
            "AssignmentExpression[left.type='MemberExpression'][left.object.name='window'][left.property.name='location']",
          message:
            'Assigning window.location navigates away from the RAGE MP CEF page. ' +
            'Use the Vue Router (hash mode) for navigation.',
        },

        // ── Chrome 80 ES2021+ API restrictions ────────────────────────────────
        // The following APIs were added in Chrome 84–98 and are NOT available in
        // the RAGE MP CEF engine. TypeScript lib:ES2020 already rejects them at
        // the type level; these rules catch any remaining runtime-only patterns.
        {
          // WeakRef: Chrome 84
          selector: "NewExpression[callee.name='WeakRef']",
          message: 'WeakRef is not available in Chrome 80 (added in Chrome 84). Use a regular reference or a Map instead.',
        },
        {
          // FinalizationRegistry: Chrome 84
          selector: "NewExpression[callee.name='FinalizationRegistry']",
          message: 'FinalizationRegistry is not available in Chrome 80 (added in Chrome 84).',
        },
        {
          // Promise.any: Chrome 85
          selector: "CallExpression[callee.type='MemberExpression'][callee.object.name='Promise'][callee.property.name='any']",
          message: 'Promise.any() is not available in Chrome 80 (added in Chrome 85). Use Promise.race() or Promise.allSettled() instead.',
        },
        {
          // String.prototype.replaceAll: Chrome 85
          selector: "CallExpression[callee.type='MemberExpression'][callee.property.name='replaceAll']",
          message: 'String.prototype.replaceAll() is not available in Chrome 80 (added in Chrome 85). Use .replace(/pattern/g, ...) instead.',
        },
        {
          // Array.prototype.at / String.prototype.at: Chrome 92
          selector: "CallExpression[callee.type='MemberExpression'][callee.property.name='at']",
          message: 'Array/String.prototype.at() is not available in Chrome 80 (added in Chrome 92). Use [arr.length - 1] indexing instead.',
        },
        {
          // Object.hasOwn: Chrome 93
          selector: "CallExpression[callee.type='MemberExpression'][callee.object.name='Object'][callee.property.name='hasOwn']",
          message: 'Object.hasOwn() is not available in Chrome 80 (added in Chrome 93). Use Object.prototype.hasOwnProperty.call(obj, key) instead.',
        },
        {
          // structuredClone: Chrome 98
          selector: "CallExpression[callee.name='structuredClone']",
          message: 'structuredClone() is not available in Chrome 80 (added in Chrome 98). Use JSON.parse(JSON.stringify(obj)) for plain objects.',
        },
      ],
    },
  },
  // ────────────────────────────────────────────────────────────────────────────

  skipFormatting,
)
