import isDevelopment from '@common/modules/isDevelopment'

export default (uri: string): string => {
    if (isDevelopment()) {
        return `${uri}`
    }

    return chrome.runtime.getURL(`${uri}`)
}
