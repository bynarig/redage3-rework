import fs from 'node:fs/promises'
import path from 'node:path'

const root = '/Users/bynarig/dev/redage_v3'
const sourceFile = path.join(root, 'src_cef', 'lang', 'ru.json')
const targetRoot = path.join(root, 'src_cef_new', 'src', 'lang')
const locales = ['ru', 'en', 'ua']

const readJson = async (filePath) => {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
}

const ensureDir = async (dirPath) => {
    await fs.mkdir(dirPath, { recursive: true })
}

const makeSkeleton = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => makeSkeleton(item))
    }
    if (value && typeof value === 'object') {
        const result = {}
        for (const [key, child] of Object.entries(value)) {
            result[key] = makeSkeleton(child)
        }
        return result
    }
    return ''
}

const writeJson = async (filePath, data) => {
    await ensureDir(path.dirname(filePath))
    await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

const main = async () => {
    const source = await readJson(sourceFile)

    for (const locale of locales) {
        await ensureDir(path.join(targetRoot, locale))
    }

    for (const [topKey, payload] of Object.entries(source)) {
        for (const locale of locales) {
            const filePath = path.join(targetRoot, locale, `${topKey}.json`)
            if (locale === 'ru') {
                await writeJson(filePath, payload)
            } else {
                await writeJson(filePath, makeSkeleton(payload))
            }
        }
    }

    console.log('Locale split complete.')
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})

