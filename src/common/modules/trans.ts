import isDevelopment from '@common/modules/isDevelopment'

export default (msg: string, ...args: string[]): string => {
    if (isDevelopment()) {
        return `${msg} ${args.join(' ')}`
    }

    return chrome.i18n.getMessage(msg, args)
}
