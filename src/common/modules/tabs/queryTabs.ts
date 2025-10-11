import type { tabs } from '@common/types/runtime'
import { runtime } from '@common/modules/runtime'

export async function queryTabs(queryInfo?: tabs.QueryInfo): Promise<tabs.Tab[]> {
    const currWindow = await runtime.windows.getCurrent()

    if (!currWindow) {
        return []
    }

    const tabs = await runtime.tabs.query(queryInfo || {})

    const err = runtime.extension.lastError()

    if (err) {
        throw new Error(err)
    }

    return tabs.filter(t => t.windowId === currWindow.id)
}
