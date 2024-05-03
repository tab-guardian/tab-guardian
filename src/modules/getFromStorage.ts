export default <T>(key: string, callback: (value: T | null) => void): void => {
    chrome.storage.sync.get(key, result => {
        const strValue: string = result[key]

        if (!strValue) {
            callback(null)
            console.warn(`[Tab Guardian]: ${key} not found in storage`)
            return
        }

        const value: T | null | undefined = JSON.parse(strValue)

        if (!value) {
            callback(null)
            console.error(`[Tab Guardian]: Failed to parse ${key} from storage`)
            return
        }

        callback(value)
    })
}
