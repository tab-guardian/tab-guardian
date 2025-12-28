import { countAllTabs } from '@common/modules/tabs/countAllTabs'
import { runtime } from '@common/modules/runtime'

export async function closeTabs(ids: number[]): Promise<void> {
    const allTabsCount = await countAllTabs()

    // create a new tab to prevent closing the browser
    if (allTabsCount === ids.length) {
        await runtime.tabs.create({})
    }

    for (const id of ids) {
        await runtime.tabs.remove(id)
    }
}
