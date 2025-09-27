import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'
import { isFirefox } from '@common/modules/browser/isFirefox'

export const LOCAL_STORAGE_QUOTA_BYTES = 5_242_880
export const FIREFOX_QUOTA_BYTES = 5_242_880

export async function saveToStorage<T>(
    key: string,
    value: T | null | undefined,
): Promise<void> {
    if (!value) {
        const msg = `Failed to save "${key}" to storage because there is not value`
        console.error(msg)
        return
    }

    const jsonStr = JSON.stringify(value)

    if (isDevelopment()) {
        localStorage.setItem(key, jsonStr)
        return
    }

    await targetBrowser().storage.local.set({ [key]: jsonStr })
}

export async function getBytesInUse(): Promise<number> {
    if (isDevelopment()) {
        return getLocalStorageUsage()
    }

    if (!isFirefox()) {
        return await chrome.storage.local.getBytesInUse()
    }

    const storageData = await browser.storage.local.get()

    const entries = Object.entries(storageData)
        .map(([key, value]) => key + JSON.stringify(value))
        .map(str => str.replaceAll('\\"', '"'))
        .join('')

    return new TextEncoder().encode(entries).length
}

export function getMaxBytes(): number {
    if (isDevelopment()) {
        return LOCAL_STORAGE_QUOTA_BYTES
    }

    return isFirefox() ? FIREFOX_QUOTA_BYTES : chrome.storage.local.QUOTA_BYTES
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
        console.error(`Failed to parse ${key} from storage`)
        return null
    }

    return value
}

function getFromLocalStorage<T>(key: string): T | null {
    const strValue: string | null = localStorage.getItem(key)

    if (!strValue) {
        console.info(`"${key}" key not found in local storage`)
        return null
    }

    const value: T | null | undefined = JSON.parse(strValue)

    if (!value) {
        console.error(`Failed to parse ${key} from local storage`)
        return null
    }

    return value
}
