import type { Link } from '@/types'
import queryTabs from '@/modules/queryTabs'
import getFakeLinks from '@/modules/getFakeLinks'
import convertTabsToLinks from '@/modules/convertTabsToLinks'
import error from '@/modules/error'

type Params = {
    closeTabs: boolean
}

export default async (params: Params): Promise<Link[]> => {
    try {
        const tabs = await queryTabs()

        if (import.meta.env.MODE === 'development') {
            return getFakeLinks()
        }

        const links = convertTabsToLinks(tabs)

        if (params.closeTabs) {
            closeTabs(tabs)
        }

        return links
    } catch (err) {
        error.err(err)
        return []
    }
}

function closeTabs(tabs: chrome.tabs.Tab[]): void {
    // create a new tab to prevent closing the browser
    chrome.tabs.create({})

    for (const tab of tabs) {
        if (tab.id) {
            chrome.tabs.remove(tab.id)
        }
    }
}
