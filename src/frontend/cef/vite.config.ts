import { fileURLToPath, pathToFileURL, URL } from 'node:url'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import ui from '@nuxt/ui/vite'

// RAGE MP CEF build config:
// Mirror the same structure here so client_packages/interface stays consistent.
const srcDir = fileURLToPath(new URL('./src', import.meta.url))
// const locale = process.env.VITE_LOCALE ?? 'ru'
const buildDir = 'build'

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    vueJsx(),
	  ui({
      colorMode: false,
      router: false,
      ui: {
        colors: {
          primary: 'sky',
          error: 'red',
          success: 'green',
          warning: 'amber',
          neutral: 'zinc',
        },
      },
    }),
    // DevTools only in dev — never ship to RAGE MP CEF bundle
    ...(command === 'serve' ? [vueDevTools()] : []),
  ],

  // Required for RAGE MP CEF: pages are loaded via file:// protocol, so
  // all asset references must be relative, not absolute.
  base: './',

  build: {
    outDir: resolve(__dirname, '../../../client_packages/interface'),
    // Don't wipe the whole folder — other locale builds live here too
    emptyOutDir: false,
    // Target Chrome 80 which matches RAGE MP's embedded Chromium version
    target: 'chrome80',
    // Match src_cef single-bundle approach; warn when JS exceeds 4 MB
    chunkSizeWarningLimit: 4096,
    // Extract all CSS into one file to mirror bundle.css from src_cef
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Mirror src_cef webpack output: build/bundle.js + build/bundle.css
        entryFileNames: `${buildDir}/bundle.js`,
        chunkFileNames: `${buildDir}/[name].js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return `${buildDir}/bundle.css`
          return `${buildDir}/[name][extname]`
        },
        // Inline all dynamic imports → single JS bundle, required for file:// protocol
        inlineDynamicImports: true,
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/views/components', import.meta.url)),
      'api': fileURLToPath(new URL('./src/api', import.meta.url)),
      'lang': fileURLToPath(new URL('./src/lang', import.meta.url)),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "${srcDir}/views/assets/styles/main" as *;`,
        importers: [
          {
            // Resolves @/ alias in SCSS @import / @use statements.
            // Also maps .sass → .scss (handles files renamed during migration).
            // Falls back to main.scss in the same directory as the importing
            // file when the aliased path does not exist on disk yet.
            findFileUrl(url: string, { containingUrl }: { containingUrl: URL | null }) {
              if (!url.startsWith('@/')) return null

              const rawPath = join(srcDir, url.slice(2))

              if (existsSync(rawPath)) return pathToFileURL(rawPath)

              // .sass → .scss fallback (post-migration renamed files)
              if (rawPath.endsWith('.sass')) {
                const scssPath = rawPath.replace(/\.sass$/, '.scss')
                if (existsSync(scssPath)) return pathToFileURL(scssPath)
              }

              // Local fallback: main.scss next to the importing file
              if (containingUrl) {
                const localMain = new URL('main.scss', containingUrl)
                if (existsSync(fileURLToPath(localMain))) return localMain
              }

              return null
            },
          },
        ],
      },
    },
  },
}))
