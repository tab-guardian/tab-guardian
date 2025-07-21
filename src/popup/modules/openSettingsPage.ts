import { isDevelopment } from '@common/modules/isDevelopment'
import { getImageURL } from '@common/modules/browser/runtime'
import { updateWindow } from '@common/modules/browser/windows'

export default async (): Promise<chrome.tabs.Tab | null> => {
    if (isDevelopment()) {
        window.open('settings.html')
        return null
    }

    const tab = await chrome.tabs.create({
        url: getImageURL('settings.html'),
        active: true,
    })

    if (tab.id) {
        updateWindow(tab.windowId)
    }

    return tab
}
