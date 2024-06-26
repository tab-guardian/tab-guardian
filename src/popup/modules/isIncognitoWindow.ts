import isDevelopment from '@common/modules/isDevelopment'

export default async (): Promise<boolean> => {
    if (isDevelopment()) {
        return true
    }

    const currWindow = await chrome.windows.getCurrent()
    return currWindow.incognito
}
