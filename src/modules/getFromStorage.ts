export default <T>(key: string, callback: (value: T | null) => void): void => {
    if (import.meta.env.MODE === 'development') {
        callback(getFromLocalStorage<T>(key))
        return
    }

    chrome.storage.sync.get(key, result => {
        callback(getFromChromeStorage<T>(key, result))
    })
}

function getFromChromeStorage<T>(key: string, result: { [key: string]: any }): T | null {
    const strValue: string = result[key]

    if (!strValue) {
        console.warn(`[Tab Guardian]: ${key} not found in storage`)
        return null
    }

    const value: T | null | undefined = JSON.parse(strValue)

    if (!value) {
        console.error(`[Tab Guardian]: Failed to parse ${key} from storage`)
        return null
    }

    return value
}

function getFromLocalStorage<T>(key: string): T | null {
    const strValue: string | null = localStorage.getItem(key)

    if (!strValue) {
        console.warn(`[Tab Guardian]: ${key} not found in local storage`)
        return null
    }

    const value: T | null | undefined = JSON.parse(strValue)

    if (!value) {
        console.error(`[Tab Guardian]: Failed to parse ${key} from local storage`)
        return null
    }

    return value
}
