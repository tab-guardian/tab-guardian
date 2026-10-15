import type { RuntimeType } from '@common/types/runtime'
import { showToast } from '@common/modules/toast'
import { formatNumber, logger } from '@common/modules'
import { trans } from '@common/modules'

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

export function throwIfQuotaExceeds(
    jsonStr: string,
    usedBytes: number,
    bytesQuota: number,
): void {
    const jsonStrBytes = new TextEncoder().encode(jsonStr).length

    const MB = 1024 * 1024
    const willBeBytes = usedBytes + jsonStrBytes

    if (willBeBytes > bytesQuota) {
        const max = formatNumber(bytesQuota / MB)
        const used = formatNumber(usedBytes / MB)
        const msg = trans('not_enough_storage', max, used)

        showToast({ text: msg, type: 'error' })

        throw new Error(msg)
    }
}

export function getFromExtentionStorage<T>(
    keys: string | string[],
    result: { [key: string]: any },
): T[] {
    const get = function (key: string) {
        const strValue: string = result[key]

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
        const val = get(keys)
        return val ? [val] : []
    }

    return keys.map(key => get(key.toString())).filter(item => item !== null)
}
