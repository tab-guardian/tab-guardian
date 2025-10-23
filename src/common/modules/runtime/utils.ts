import type { RuntimeType } from '@common/types/runtime'
import { showToast } from '@common/modules/toast'
import { formatNumber, logger } from '@common/modules'
import { trans } from '@common/modules'

export function isRuntime(runtime: RuntimeType): boolean {
    switch (runtime) {
        case 'firefox':
            return (
                typeof browser !== 'undefined' &&
                browser.runtime.getManifest().manifest_version === 2
            )
        case 'chrome':
            return (
                typeof chrome !== 'undefined' &&
                chrome.runtime.getManifest().manifest_version === 3
            )
        case 'web':
            return typeof chrome === 'undefined' && typeof browser === 'undefined'
        default:
            throw new Error('Unknown runtime is used')
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

        showToast({ text: msg, type: 'error', duration: 5000 })

        throw new Error(msg)
    }
}

export function getFromExtentionStorage<T>(
    key: string,
    result: { [key: string]: any },
): T | null {
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
