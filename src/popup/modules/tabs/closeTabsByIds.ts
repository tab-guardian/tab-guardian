import countAllTabs from '@/modules/tabs/countAllTabs'
import { targetBrowser } from '@common/modules/browser/targetBrowser'

export default async (ids: number[]): Promise<void> => {
    const allTabsCount = await countAllTabs()
    const target = targetBrowser()

    // create a new tab to prevent closing the browser
    if (allTabsCount === ids.length) {
        target.tabs.create({})
    }

    for (const id of ids) {
        target.tabs.remove(id)
    }
}
