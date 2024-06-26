import error from '@common/modules/error'

export default async <T>(
    key: string,
    value: T | null | undefined,
): Promise<void> => {
    if (!value) {
        const msg = `Failed to save "${key}" to storage because there is not value`
        error.err(msg)
        return
    }

    const jsonStr = JSON.stringify(value)

    if (import.meta.env.MODE === 'development') {
        localStorage.setItem(key, jsonStr)
        return
    }

    await chrome.storage.local.set({ [key]: jsonStr })
}
