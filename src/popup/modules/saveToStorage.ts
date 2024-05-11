import error from '@/modules/error'

export default async <T>(key: string, value: T | null | undefined): Promise<void> => {
    if (!value) {
        error.err(
            `Failed to save ${key} to storage because value is '${value}'`,
        )
        return
    }

    const stringValue = JSON.stringify(value)

    if (import.meta.env.MODE === 'development') {
        localStorage.setItem(key, stringValue)
        return
    }

    await chrome.storage.sync.set({ [key]: stringValue })
}
