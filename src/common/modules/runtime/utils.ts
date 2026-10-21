import type { RuntimeType } from '@common/types/runtime'
import { logger } from '@common/modules'

export function isRuntime(runtime: RuntimeType): boolean {
    switch (runtime) {
        case 'firefox':
            return isFirefox()
        case 'chrome':
            return isChrome()
        case 'web':
            return !isFirefox() && !isChrome()
        default:
            throw new Error('Unknown runtime is used')
    }
}

function isFirefox(): boolean {
    try {
        return (
            typeof browser !== 'undefined' &&
            !!browser.runtime?.id &&
            browser.runtime.getManifest?.()?.manifest_version === 2
        )
    } catch {
        return false
    }
}

function isChrome(): boolean {
    try {
        return (
            typeof chrome !== 'undefined' &&
            !!chrome.runtime?.id &&
            chrome.runtime.getManifest?.()?.manifest_version === 3
        )
    } catch {
        return false
    }
}

export function decodeStorageEntries<T>(
    keys: string | string[],
    entries: { [key: string]: any },
): T[] {
    const decodeEntry = function (key: string) {
        const strValue: string = entries[key]

        if (!strValue) {
            return null
        }

        const value: T | null | undefined = JSON.parse(strValue)

        if (!value) {
            logger().error(`Failed to parse ${key} from storage`)
            return null
        }

        return value
    }

    if (typeof keys === 'string') {
        const val = decodeEntry(keys)
        return val ? [val] : []
    }

    return keys.map(key => decodeEntry(key)).filter(item => item !== null)
}
