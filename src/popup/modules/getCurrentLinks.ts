import type { Link } from '@/types'
import queryTabs from '@/modules/queryTabs'

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
        console.error(err)
        return []
    }
}

function convertTabsToLinks(tabs: chrome.tabs.Tab[], params: Params): Link[] {
    const links: Link[] = []

    for (const tab of tabs) {
        if (!tab.url) {
            continue
        }

        links.push({
            id: tab.id || Date.now(),
            title: tab.title || tab.url || '<no title>',
            url: tab.url,
            favIconUrl: tab.favIconUrl || '', // @todo: use default favicon icon
        })

        if (tab.id && params.closeTabs) {
            chrome.tabs.remove(tab.id)
        }
    }

    return links
}

function getFakeLinks(): Link[] {
    return [
        {
            id: 1,
            url: 'https://duck.com/',
            title: 'Duck Duck Go',
            favIconUrl: 'https://duckduckgo.com/favicon.ico',
        },
        {
            id: 2,
            url: 'https://serhii.io/',
            title: 'Serhii Blog',
            favIconUrl: 'https://serhii.io/favicon.png',
        },
    ]
}
