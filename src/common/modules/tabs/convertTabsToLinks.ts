import type { Link } from '@common/types'
import type { tabs } from '@common/types/runtime'
import { runtime } from '@common/modules/runtime'
import { generateId } from '@common/modules/group'

export function convertTabsToLinks(tabs: tabs.Tab[]): Link[] {
    const links: Link[] = []

    for (const tab of tabs) {
        if (!tab.url) {
            continue
        }

        links.push({
            id: generateId(),
            title: tab.title || tab.url || '<no title>',
            url: tab.url,
            favIconUrl: getFaviconIconUrl(tab),
            isPinned: tab.pinned,
        })
    }

    return links
}

const icons = [
    ['http://localhost', 'localhost.png'],
    ['chrome://', 'chrome.png'],
    ['brave://', 'brave.png'],
    ['firefox:', 'firefox.png'],
    ['about:', 'firefox.png'],
]

function getFaviconIconUrl(tab: tabs.Tab): string {
    if (tab.url) {
        for (const [prefix, icon] of icons) {
            if (tab.url.startsWith(prefix)) {
                return runtime.getUrl(`images/${icon}`)
            }
        }
    }

    return tab.favIconUrl || runtime.getUrl('images/no-image.png')
}
