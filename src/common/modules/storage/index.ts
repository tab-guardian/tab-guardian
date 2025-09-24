import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'
import { isFirefox } from '@common/modules/browser/isFirefox'
import { error } from '@common/modules/error'

export async function saveToStorage<T>(
    key: string,
    value: T | null | undefined,
): Promise<void> {
    if (!value) {
        const msg = `Failed to save "${key}" to storage because there is not value`
        error.err(msg)
        return
    }

    const jsonStr = JSON.stringify(value)

    if (isDevelopment()) {
        localStorage.setItem(key, jsonStr)
        return
    }

    await targetBrowser().storage.local.set({ [key]: jsonStr })
}

export function getFromStorage<T>(key: string): Promise<T | null> {
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

export async function deleteFromStorage(key: string): Promise<void> {
    if (isDevelopment()) {
        localStorage.removeItem(key)
        return
    }

    await targetBrowser().storage.local.remove(key)
}

export function getLocalStorageUsage(): number {
    let totalBytes = 0

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (!key) {
            continue
        }

        const value = localStorage.getItem(key)

        if (value) {
            totalBytes += key.length + value.length
        }
    }

    return totalBytes
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
