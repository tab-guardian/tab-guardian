import type { Tab } from '@common/types'
import type { QueryInfo } from '@common/types'
import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

export function queryTabs(queryInfo?: QueryInfo): Promise<Tab[]> {
    return new Promise(async (resolve, reject) => {
        if (isDevelopment()) {
            console.info(
                'Cannot query tabs because chrome.tabs.query is not available in development mode',
            )

            resolve([])
            return
        }

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
