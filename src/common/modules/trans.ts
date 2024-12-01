import isDevelopment from '@common/modules/isDevelopment'

let englishMessages: { [key: string]: { message: string } } | null = null

if (isDevelopment()) {
    englishMessages = (await import('../../../public/_locales/en_US/messages.json'))
        .default
}

export default (msg: string, ...args: string[]): string => {
    if (englishMessages) {
        if (!englishMessages[msg]) {
            console.warn(`English translation not found for key "${msg}"`)
        }

        return englishMessages[msg].message
    }

    return chrome.i18n.getMessage(msg, args)
}
