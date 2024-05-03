export default <T>(key: string, value: T | null | undefined): void => {
    if (!value) {
        console.error(
            `[Tab Guardian]: Failed to save ${key} to storage because value is '${value}'`,
        )
        return
    }

    chrome.storage.sync.set({
        [key]: JSON.stringify(value),
    })
}
