import type { Tab } from '@common/types'
import { isDevelopment } from '@common/modules/isDevelopment'
import { getPublicURL } from '@common/modules/browser/url'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

export async function openSettingsPage(): Promise<Tab | null> {
    if (isDevelopment()) {
        window.open('settings.html')
        return null
    }

    const target = targetBrowser()

    const tab = await target.tabs.create({
        url: getPublicURL('settings.html'),
        active: true,
    })

    if (tab && tab.windowId) {
        target.windows.update(tab.windowId, { focused: true })
    }

    return tab
}
