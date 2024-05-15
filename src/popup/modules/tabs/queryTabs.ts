import error from '@/modules/error'
import isDevelopment from '@/modules/isDevelopment'

export default (): Promise<chrome.tabs.Tab[]> => {
    return new Promise((resolve, reject) => {
        if (isDevelopment()) {
            error.info(
                'Cannot query tabs because chrome.tabs.query is not available in development mode',
            )

            resolve([])
            return
        }

        chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(tabs)
            }
        })
    })
}
