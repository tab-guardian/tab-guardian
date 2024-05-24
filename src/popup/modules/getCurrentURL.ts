import isDevelopment from '@common/modules/isDevelopment'

export default async (): Promise<string | null> => {
    if (isDevelopment()) {
        return window.location.href
    }

    return new Promise(resolve => {
        chrome.tabs.query({ active: true }, tabs => {
            if (tabs.length === 0) {
                resolve(null)
            }

            resolve(tabs[0].url || null)
        })
    })
}
