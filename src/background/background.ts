import setIconAccordingToTheme from '@bg/modules/setIconAccordingToTheme'

chrome.runtime.onMessage.addListener(request => {
    if (request.theme) {
        setIconAccordingToTheme(request.theme)
    }
})
