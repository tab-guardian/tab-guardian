import type { Tab } from '@common/types/runtime'
import { showToast } from '@common/modules/showToast'
import { formatNumber } from '@common/modules/numberUtil'
import { trans } from '@common/modules/trans'

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

export function mapToTab(tab: chrome.tabs.Tab | browser.tabs.Tab): Tab {
    return {
        status: tab.status,
        index: tab.index,
        openerTabId: tab.openerTabId,
        title: tab.title,
        url: tab.url,
        pinned: tab.pinned,
        highlighted: tab.highlighted,
        windowId: tab.windowId,
        active: tab.active,
        favIconUrl: tab.favIconUrl,
        id: tab.id,
        incognito: tab.incognito,
        audible: tab.audible,
        discarded: tab.discarded,
        autoDiscardable: tab.autoDiscardable,
        width: tab.width,
        height: tab.height,
        sessionId: tab.sessionId,
        lastAccessed: tab.lastAccessed,
    }
}
