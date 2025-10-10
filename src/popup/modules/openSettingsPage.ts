import type { tabs } from '@common/types/runtime'
import { runtime } from '@common/modules/runtime'
import { isDevelopment } from '@common/modules/isDevelopment'
import { getPublicURL } from '@common/modules/browser/url'

export async function openSettingsPage(): Promise<tabs.Tab | null> {
    if (isDevelopment()) {
        window.open('settings.html')
        return null
    }

    const tab = await runtime.tabs.create({
        url: getPublicURL('settings.html'),
        active: true,
    })

    if (tab && tab.windowId) {
        runtime.windows.update(tab.windowId, { focused: true })
    }

    return tab
}
