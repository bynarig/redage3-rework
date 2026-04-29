// const url = "https://cloud.redage.net/lang";

import test from './ru.json'
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'ru',
    messages: {
        ru: test
    }
})

const format = (text: string, ...args: any[]) => {
    return text.replace(/{(\d+)}/g, function (match: string, number: number) {
        return typeof args[number] !== "undefined" ? args[number] : match;
    });
};

export const translateText = (...keys: any[]) => {
    try {
        let i18nKey = '';
        let formatArgs: any[] | undefined = undefined;

        let currentObj: any = test;
        for (let i = 0; i < keys.length; i++) {
            currentObj = currentObj[keys[i]];

            if (i18nKey.length > 0) {
                i18nKey += '.' + keys[i];
            } else {
                i18nKey = keys[i];
            }

            if (typeof currentObj === "undefined") {
                return `Неизвестный ключ ${keys.join(".")}`;
            }

            if (typeof currentObj === "string") {
                formatArgs = [...keys];
                formatArgs.splice(0, i + 1);
                break;
            }
        }

        let result = i18n.global.t(i18nKey);

        if (formatArgs && formatArgs.length > 0) {
            result = format(result, ...formatArgs);
        }

        return result;
    } catch {
        return `Неизвестный ключ ${keys.join(".")}`;
    }
};
