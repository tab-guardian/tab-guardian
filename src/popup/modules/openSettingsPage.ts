import type { Tab } from '@common/types'
import { isDevelopment } from '@common/modules/isDevelopment'
import { getImageURL } from '@common/modules/browser/runtime'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

export default async (): Promise<Tab | null> => {
    if (isDevelopment()) {
        window.open('settings.html')
        return null
    }

    const target = targetBrowser()

    const tab = await target.tabs.create({
        url: getImageURL('settings.html'),
        active: true,
    })

    if (tab && tab.windowId) {
        target.windows.update(tab.windowId, { focused: true })
    }

    return tab
}
