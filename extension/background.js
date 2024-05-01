const isFirefox = typeof browser !== 'undefined'

if (isFirefox) {
    browser.browserAction.onClicked.addListener(function (tab) {
        //
    })
} else {
    if (!chrome.action) {
        chrome.action = chrome.browserAction
    }

    chrome.action.onClicked.addListener(function (tab) {
        //
    })
}
