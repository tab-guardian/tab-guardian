import error from '@common/modules/error'
import isDevelopment from '@common/modules/isDevelopment'

export default (): Promise<chrome.tabs.Tab[]> => {
    return new Promise(async (resolve, reject) => {
        if (isDevelopment()) {
            error.info(
                'Cannot query tabs because chrome.tabs.query is not available in development mode',
            )

            resolve([])
            return
        }

        const window = await chrome.windows.getCurrent()

        chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(tabs.filter(t => t.windowId === window.id))
            }
        })
    })
}
