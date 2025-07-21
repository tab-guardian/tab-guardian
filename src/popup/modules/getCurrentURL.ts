import { isDevelopment } from '@common/modules/isDevelopment'
import { isFirefox } from '@common/modules/browser/isFirefox'
import hashURL from '@/modules/hashURL'

export default async (hash = false): Promise<string | null> => {
    if (isDevelopment()) {
        return window.location.href
    }

    return new Promise(resolve => {
        const tabs = isFirefox() ? browser.tabs : chrome.tabs

        tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length === 0) {
                resolve(null)
            }

            const url = tabs[0].url

            if (!url) {
                resolve(null)
                return
            }

            if (hash) {
                resolve(hashURL(url))
                return
            }

            resolve(url)
        })
    })
}
