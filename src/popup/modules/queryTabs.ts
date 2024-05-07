export default (): Promise<chrome.tabs.Tab[]> => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(tabs)
            }
        })
    })
}
