export default (): Promise<chrome.tabs.Tab[]> => {
    return new Promise((resolve, reject) => {
        if (!chrome || !chrome.tabs) {
            console.warn('[Tab Guardian]: chrome.tabs is not available')
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
