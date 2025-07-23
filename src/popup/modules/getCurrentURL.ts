import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'
import { hashURL } from '@/modules/hashURL'

export async function getCurrentURL(hash = false): Promise<string | null> {
    if (isDevelopment()) {
        return window.location.href
    }

    return new Promise(resolve => {
        targetBrowser().tabs.query({ active: true, currentWindow: true }, tabs => {
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
