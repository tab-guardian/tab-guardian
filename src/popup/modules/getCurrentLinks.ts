import type { Link } from '@/types'
import queryTabs from '@/modules/queryTabs'
import getFakeLinks from '@/modules/getFakeLinks'
import getImageUrl from '@/modules/getImageUrl'
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

        return convertTabsToLinks(tabs, params)
    } catch (err) {
        error.err(err as string)
        return []
    }
}

function convertTabsToLinks(
    tabs: chrome.tabs.Tab[],
    params: Params,
): Link[] {
    const links: Link[] = []

    for (const tab of tabs) {
        if (!tab.url) {
            continue
        }

        links.push({
            id: tab.id || Date.now(),
            title: tab.title || tab.url || '<no title>',
            url: tab.url,
            favIconUrl: tab.favIconUrl || getImageUrl('no-image.png'),
        })
    }

    if (params.closeTabs) {
        closeTabs(tabs)
    }

    return links
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
