chrome.runtime.onMessage.addListener(request => {
    if (request.type === 'closeTabs') {
        closeTabs(request.payload)
    }
})

async function closeTabs(ids: number[]): Promise<void> {
    // create a new tab to prevent closing the browser
    await chrome.tabs.create({})

    for (const id of ids) {
        await chrome.tabs.remove(id)
    }
}
