#!/usr/bin/env node
/**
 * Renames .svelte → .vue and .sass → .scss under src/,
 * then rewrites every import/lang attribute that references the old extensions
 * in ALL text files inside src/ (skips known binary formats).
 *
 * Usage:
 *   node scripts/rename-extensions.mjs            # apply
 *   node scripts/rename-extensions.mjs --dry-run  # preview only
 */

import { readdir, rename, readFile, writeFile } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DRY_RUN = process.argv.includes('--dry-run')
const SRC = join(dirname(fileURLToPath(import.meta.url)), '../src')

const EXT_MAP = { '.svelte': '.vue', '.sass': '.scss' }

const BINARY_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg',
  '.ttf', '.woff', '.woff2', '.eot',
  '.mp3', '.mp4', '.ogg', '.wav', '.webm',
  '.pdf', '.zip', '.gz', '.tar',
])

async function walk(dir) {
  const result = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) result.push(...(await walk(full)))
    else result.push(full)
  }
  return result
}

async function main() {
  const allFiles = await walk(SRC)
  const targets = allFiles.filter(f => EXT_MAP[extname(f)])

  if (targets.length === 0) {
    console.log('Nothing to rename.')
    return
  }

  // Step 1 — rewrite import strings and lang= attributes in every text file
  const textFiles = allFiles.filter(f => !BINARY_EXTS.has(extname(f).toLowerCase()))
  for (const file of textFiles) {
    const original = await readFile(file, 'utf8')
    let updated = original

    for (const [oldExt, newExt] of Object.entries(EXT_MAP)) {
      // Rewrite extension inside quoted import paths: '...foo.sass' → '...foo.scss'
      updated = updated.replace(
        new RegExp(`(?<=['"` + '`' + `][^'"` + '`' + `]*)\\${oldExt}(?=['"` + '`' + `])`, 'g'),
        newExt,
      )
      // Rewrite lang attribute: lang="sass" → lang="scss"
      updated = updated.replace(
        new RegExp(`(lang=["'])${oldExt.slice(1)}(["'])`, 'g'),
        `$1${newExt.slice(1)}$2`,
      )
    }

    if (updated !== original) {
      if (DRY_RUN) {
        console.log(`[dry-run] would rewrite: ${file.replace(SRC, 'src')}`)
      } else {
        await writeFile(file, updated, 'utf8')
        console.log(`  rewrote: ${file.replace(SRC, 'src')}`)
      }
    }
  }

  // Step 2 — rename the files themselves
  for (const oldPath of targets) {
    const oldExt = extname(oldPath)
    const newPath = oldPath.slice(0, -oldExt.length) + EXT_MAP[oldExt]
    const rel = oldPath.replace(SRC, 'src')
    const relNew = newPath.replace(SRC, 'src')
    if (DRY_RUN) {
      console.log(`[dry-run] ${rel}  →  ${relNew}`)
    } else {
      await rename(oldPath, newPath)
      console.log(`  renamed: ${rel}  →  ${relNew}`)
    }
  }

  const verb = DRY_RUN ? 'would rename' : 'renamed'
  console.log(`\nDone — ${verb} ${targets.length} file(s).`)
}

main().catch(err => { console.error(err); process.exit(1) })
