import { isDevelopment } from '@common/modules/isDevelopment'
import { isFirefox } from '@common/modules/browser/isFirefox'

export default async (key: string): Promise<void> => {
    if (isDevelopment()) {
        localStorage.removeItem(key)
        return
    }

    if (isFirefox()) {
        await browser.storage.local.remove(key)
        return
    }

    await chrome.storage.local.remove(key)
}
