import type { tabs } from '@common/types/runtime'
import { runtime } from '@common/modules/runtime'

export async function openSettingsPage(): Promise<tabs.Tab | null> {
    const tab = await runtime.tabs.create({
        url: runtime.getUrl('settings.html'),
        active: true,
    })

    if (!tab) {
        return null
    }

    if (tab.windowId) {
        runtime.windows.update(tab.windowId, { focused: true })
    }

    return tab
}
