export default (tabs: chrome.tabs.Tab[]): void => {
    // create a new tab to prevent closing the browser
    chrome.tabs.create({})

    for (const tab of tabs) {
        if (tab.id) {
            chrome.tabs.remove(tab.id)
        }
    }
}
