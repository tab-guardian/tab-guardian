import isDevelopment from '@common/modules/isDevelopment'
import error from '@common/modules/error'

export default <T>(key: string): Promise<T | null> => {
    return new Promise(resolve => {
        if (isDevelopment()) {
            return resolve(getFromLocalStorage<T>(key))
        }

        chrome.storage.local.get(key, result => {
            resolve(getFromChromeStorage<T>(key, result))
        })
    })
}

function getFromChromeStorage<T>(
    key: string,
    result: { [key: string]: any },
): T | null {
    const strValue: string = result[key]

    if (!strValue) {
        return null
    }

    const value: T | null | undefined = JSON.parse(strValue)

    if (!value) {
        error.err(`Failed to parse ${key} from storage`)
        return null
    }

    return value
}

function getFromLocalStorage<T>(key: string): T | null {
    const strValue: string | null = localStorage.getItem(key)

    if (!strValue) {
        error.info(`"${key}" key not found in local storage`)
        return null
    }

    const value: T | null | undefined = JSON.parse(strValue)

    if (!value) {
        error.err(`Failed to parse ${key} from local storage`)
        return null
    }

    return value
}
