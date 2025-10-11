import type { RuntimeType } from '@common/types/runtime'
import { showToast } from '@common/modules/toast'
import { formatNumber } from '@common/modules/utils'
import { trans } from '@common/modules/utils'

export function isRuntime(runtime: RuntimeType): boolean {
    switch (runtime) {
        case 'firefox':
            return typeof browser !== 'undefined'
        case 'chrome':
            return typeof browser === 'undefined' && typeof chrome !== 'undefined'
        case 'web':
            return typeof window !== undefined
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

    const MB = (1024 * 1024)
    const willBeBytes = usedBytes + jsonStrBytes

    if (willBeBytes > bytesQuota) {
        const max = formatNumber(bytesQuota / MB)
        const used = formatNumber(usedBytes / MB)
        const msg = trans('not_enough_storage', max, used)

        showToast(msg, 'error', 5000)

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
        console.error(`Failed to parse ${key} from storage`)
        return null
    }

    return value
}
