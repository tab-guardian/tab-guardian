import type { Tab, TabsQueryInfo } from '@common/types/runtime'
import { runtime } from '@common/modules/runtime'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

export async function queryTabs(queryInfo?: TabsQueryInfo): Promise<Tab[]> {
    const target = targetBrowser()
    const curWindow = await target.windows.getCurrent()

        const target = targetBrowser()
        const curWindow = await target.windows.getCurrent()

        target.tabs.query(queryInfo || {}, (tabs: Tab[]) => {
            if (target.runtime.lastError) {
                reject(target.runtime.lastError)
            } else {
                resolve(tabs.filter(t => t.windowId === curWindow.id))
            }
        })
    })
}
