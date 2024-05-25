export default (ids: number[]): void => {
    // create a new tab to prevent closing the browser
    chrome.tabs.create({})

    for (const id of ids) {
        chrome.tabs.remove(id)
    }
}
