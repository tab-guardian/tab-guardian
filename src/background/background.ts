import type { ThemeMessage } from '@/types/messages'
import setIconAccordingToTheme from '@bg/modules/setIconAccordingToTheme'

chrome.runtime.onMessage.addListener(request => {
    if (request.theme) {
        const themeRequest = request as ThemeMessage
        setIconAccordingToTheme(themeRequest.theme)
    }
})
