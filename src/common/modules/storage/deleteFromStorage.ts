import isDevelopment from '@common/modules/isDevelopment'

export default async (key: string): Promise<void> => {
    if (isDevelopment()) {
        localStorage.removeItem(key)
        return
    }

    await chrome.storage.local.remove(key)
}
