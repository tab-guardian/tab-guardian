import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

let englishMessages: { [key: string]: { message: string } } | null = null

if (isDevelopment()) {
    const devLocale = import.meta.env.VITE_DEV_LOCALE as 'ru' | 'zh_CH' | 'en'

    englishMessages = (await import(`../../_locales/${devLocale}/messages.json`))
        .default
}

export function trans(msg: string, ...args: string[]): string {
    if (englishMessages) {
        if (!englishMessages[msg]) {
            console.warn(`English translation not found for key "${msg}"`)
        }

        return englishMessages[msg].message
    }

    return getMessage(msg, args)
}

function getMessage(msg: string, args?: string | string[]): string {
    return targetBrowser().i18n.getMessage(msg, args)
}
