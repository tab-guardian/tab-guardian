import isDevelopment from '@common/modules/isDevelopment'

export default async (focusOnTab: boolean): Promise<chrome.tabs.Tab | null> => {
    if (isDevelopment()) {
        window.open('settings.html')
        return null
    }

    const tab = await chrome.tabs.create({
        url: chrome.runtime.getURL('settings.html'),
        active: true,
    })

    if (focusOnTab && tab.id) {
        chrome.windows.update(tab.windowId, { focused: true })
    }

    return tab
}