import { isDevelopment } from '@common/modules/isDevelopment'
import { getImageURL } from '@common/modules/browser/runtime'

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
        chrome.windows.update(tab.windowId, { focused: true })
    }

    return tab
}
