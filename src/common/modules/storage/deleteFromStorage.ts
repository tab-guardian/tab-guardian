import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

export async function deleteFromStorage(key: string): Promise<void> {
    if (isDevelopment()) {
        localStorage.removeItem(key)
        return
    }

    await targetBrowser().storage.local.remove(key)
}
