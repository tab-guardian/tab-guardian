import isDevelopment from '@common/modules/isDevelopment'
import hashURL from '@/modules/hashURL'
import queryTabs from './tabs/queryTabs'

export default async (hash = false): Promise<string | null> => {
    if (isDevelopment()) {
        return window.location.href
    }

    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
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
