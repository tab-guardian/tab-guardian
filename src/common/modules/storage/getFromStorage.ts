import { isDevelopment } from '@common/modules/isDevelopment'
import { isFirefox } from '@common/modules/browser/isFirefox'
import error from '@common/modules/error'

export default <T>(key: string): Promise<T | null> => {
    return new Promise(resolve => {
        if (isDevelopment()) {
            return resolve(getFromLocalStorage<T>(key))
        }

        if (isFirefox()) {
            browser.storage.local.get(key).then(result => {
                resolve(getFromBrowserStorage<T>(key, result))
            })
            return
        }

        chrome.storage.local.get(key, result => {
            resolve(getFromBrowserStorage<T>(key, result))
        })
    })
}

function getFromBrowserStorage<T>(
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
