import setIconAccordingToTheme from '@bg/modules/setIconAccordingToTheme'

chrome.runtime.onMessage.addListener(request => {
    if (request.theme) {
        setIconAccordingToTheme(request.theme)
    }
})

chrome.tabs.onUpdated.addListener((tabId, tabInfo) => {
    chrome.tabs.query({}, function (tabs) {})
})
