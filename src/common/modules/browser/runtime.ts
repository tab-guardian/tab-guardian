import { isDevelopment } from '@common/modules/isDevelopment'
import { isFirefox } from '@common/modules/browser/isFirefox'

export function getImageURL(uri: string): string {
    if (isDevelopment()) {
        return `${uri}`
    }

    return isFirefox()
        ? browser.runtime.getURL(`${uri}`)
        : chrome.runtime.getURL(`${uri}`)
}
