import { isDevelopment } from '@common/modules/isDevelopment'
import { isFirefox } from '@common/modules/isFirefox'

export default async (): Promise<boolean> => {
    if (isDevelopment()) {
        return true
    }

    const currWindow = isFirefox()
        ? await browser.windows.getCurrent()
        : await chrome.windows.getCurrent()

    return currWindow.incognito
}
