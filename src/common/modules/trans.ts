import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

let translationMessages: { [key: string]: { message: string } } | null = null

if (isDevelopment()) {
    const devLocale = import.meta.env.VITE_DEV_LOCALE as 'ru' | 'zh_CH' | 'en'

    translationMessages = (await import(`../../_locales/${devLocale}/messages.json`))
        .default
}

export function trans(msg: string, ...args: string[]): string {
    if (translationMessages) {
        if (!translationMessages[msg]) {
            console.warn(`English translation not found for key "${msg}"`)
            return msg
        }

        return translationMessages[msg].message
    }

    return getMessage(msg, args)
}

function getMessage(msg: string, args?: string | string[]): string {
    return targetBrowser().i18n.getMessage(msg, args)
}
