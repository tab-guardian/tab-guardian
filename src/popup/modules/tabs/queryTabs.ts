import type { Tab, TabsQueryInfo } from '@common/types/runtime'
import { runtime } from '@common/modules/runtime'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

export async function queryTabs(queryInfo?: TabsQueryInfo): Promise<Tab[]> {
    const target = targetBrowser()
    const curWindow = await target.windows.getCurrent()

    const tabs = await runtime.tabs.query(queryInfo || {})

    const err = target.runtime.lastError

    if (err) {
        throw new Error(err.message)
    }

    return tabs.filter(t => t.windowId === curWindow.id)
}
