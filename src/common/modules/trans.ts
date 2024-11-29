export default (msg: string, ...args: string[]): string => {
    return chrome.i18n.getMessage(msg, args)
}
