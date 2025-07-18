import { isDevelopment } from '@common/modules/isDevelopment'
import { isFirefox } from '@common/modules/browser/isFirefox'

export async function isIncognito(): Promise<boolean> {
    if (isDevelopment()) {
        return true
    }

    const currWindow = isFirefox()
        ? await browser.windows.getCurrent()
        : await chrome.windows.getCurrent()

    return currWindow.incognito
}

export async function update(windowId: number) {
    if (isFirefox()) {
        // todo: here
    }

    chrome.windows.update(windowId, { focused: true })
}
