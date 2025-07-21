import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

export async function isIncognito(): Promise<boolean> {
    if (isDevelopment()) {
        return true
    }

    const currWindow = await targetBrowser().windows.getCurrent()

    return currWindow.incognito
}
