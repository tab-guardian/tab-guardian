export default <T>(key: string, value: T | null | undefined): void => {
    if (!value) {
        console.error(
            `[Tab Guardian]: Failed to save ${key} to storage because value is '${value}'`,
        )
        return
    }

    const stringValue = JSON.stringify(value)

    if (import.meta.env.MODE === 'development') {
        localStorage.setItem(key, stringValue)
        return
    }

    chrome.storage.sync.set({ [key]: stringValue })
}
