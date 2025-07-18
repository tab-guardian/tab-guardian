import { isDevelopment } from '@common/modules/isDevelopment'
import isFirefox from '@common/modules/isFirefox'

let englishMessages: { [key: string]: { message: string } } | null = null

if (isDevelopment()) {
    const devLocale = import.meta.env.VITE_DEV_LOCALE as 'ru' | 'zh_CH' | 'en'

    englishMessages = (await import(`../../_locales/${devLocale}/messages.json`))
        .default
}

export default (msg: string, ...args: string[]): string => {
    if (englishMessages) {
        if (!englishMessages[msg]) {
            console.warn(`English translation not found for key "${msg}"`)
        }

        return englishMessages[msg].message
    }

    return getMessage(msg, args)
}

function getMessage(msg: string, args?: string | string[]): string {
    if (isFirefox()) {
        return browser.i18n.getMessage(msg, args)
    }

    return chrome.i18n.getMessage(msg, args)
}
