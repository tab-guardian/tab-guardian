import error from '@common/modules/error'
import getBytesPerItemLimit from '@common/modules/storage/getBytesPerItemLimit'

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
    const bytesLimit = getBytesPerItemLimit(key)
    const jsonBytes = new TextEncoder().encode(jsonStr).length

    if (jsonBytes > bytesLimit) {
        const msg = `Failed to save "${key}" to storage because it exceeds the limit of ${bytesLimit} bytes. It has ${jsonBytes} bytes.`
        error.err(msg)
        return
    }

    if (import.meta.env.MODE === 'development') {
        localStorage.setItem(key, jsonStr)
        return
    }

    await chrome.storage.sync.set({ [key]: jsonStr })
}
