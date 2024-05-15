import type { OpenTabMessage, ThemeMessage } from '@/types/messages'
import setIconAccordingToTheme from '@bg/modules/setIconAccordingToTheme'

chrome.runtime.onMessage.addListener(request => {
    if (request.theme) {
        const themeRequest = request as ThemeMessage
        setIconAccordingToTheme(themeRequest.theme)
    } else if (request.openTab) {
        const openTabRequest = request as OpenTabMessage

        chrome.tabs.create({
            url: openTabRequest.openTab.url,
            // `active` doesn't seem to work in Brave
            active: openTabRequest.openTab.active,
        })
    }
})
