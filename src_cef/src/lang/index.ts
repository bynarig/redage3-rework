// const url = "https://cloud.redage.net/lang";

import { createI18n } from 'vue-i18n'

type LocaleMessages = Record<string, any>

type GlobModule = { default?: LocaleMessages }

const modules = import.meta.glob('./**/*.json', { eager: true }) as Record<string, GlobModule>

const buildMessages = (): Record<string, LocaleMessages> => {
	const messages: Record<string, LocaleMessages> = {}

	Object.entries(modules).forEach(([path, mod]) => {
		// Updated regex: makes the slash and trailing path optional
		// ./ru.json -> match[1] = 'ru', match[2] = undefined
		// ./en/admin/noclip.json -> match[1] = 'en', match[2] = 'admin/noclip'
		const match = path.match(/\.\/([^/]+)(?:\/(.+))?\.json$/)
		if (!match) return

		let locale: string
		let keyPath: string

		if (typeof match[1] === 'string' && typeof match[2] === 'string') {
			locale = match[1]
			keyPath = match[2]
		}
		else{
			return `Undefined key in i18n ${path}`
		}

		if (!messages[locale]) messages[locale] = {}
		let target: LocaleMessages = messages[locale] as LocaleMessages
		const fileContent = (mod && mod.default) ? mod.default : mod

		if (keyPath) {
			// 2a. Handle nested files (e.g., en/admin/noclip.json)
			const segments = keyPath.split('/')
			while (segments.length > 1) {
				const segment = segments.shift() as string
				if (!target[segment]) target[segment] = {}
				target = target[segment] as LocaleMessages
			}

			const lastKey = segments[0]

			if (typeof lastKey !== 'string') return `Undefined key in i18n ${path} #2`

			target[lastKey] = fileContent
		} else {
			// 2b. Handle root files (e.g., ru.json)
			// Merge the JSON contents directly into the root of the locale
			Object.assign(target, fileContent)
		}
	})

	return messages
}

const messages = buildMessages()

export const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
})

const format = (text: string, ...args: any[]) => {
    return text.replace(/{(\d+)}/g, function (match: string, number: number) {
        return typeof args[number] !== "undefined" ? args[number] : match
    })
}

const getLocaleMessages = (): LocaleMessages => {
    const localeValue = typeof i18n.global.locale === 'string'
        ? i18n.global.locale
        : i18n.global.locale.value

    return messages[localeValue] || messages.ru || {}
}

// Last string key is used as the visible fallback text when the key path is missing.
// e.g. translateText('popups', 'confirm', 'Cancel') → falls back to 'Cancel'
export const translateText = (...keys: any[]) => {
    const fallback = typeof keys[keys.length - 1] === 'string' ? keys[keys.length - 1] : ''
    try {
        let i18nKey = ''
        let formatArgs: any[] | undefined = undefined

        let currentObj: any = getLocaleMessages()
        for (let i = 0; i < keys.length; i++) {
            currentObj = currentObj[keys[i]]

            if (i18nKey.length > 0) {
                i18nKey += '.' + keys[i]
            } else {
                i18nKey = keys[i]
            }

            if (typeof currentObj === 'undefined') {
                return fallback
            }

            if (typeof currentObj === 'string') {
                formatArgs = [...keys]
                formatArgs.splice(0, i + 1)
                break
            }
        }

        let result = i18n.global.t(i18nKey)

        if (formatArgs && formatArgs.length > 0) {
            result = format(result, ...formatArgs)
        }

        return result
    } catch {
        return fallback
    }
}
