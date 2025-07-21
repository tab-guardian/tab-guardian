import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

export function getImageURL(uri: string): string {
    if (isDevelopment()) {
        return `${uri}`
    }

    return targetBrowser().runtime.getURL(`${uri}`)
}
