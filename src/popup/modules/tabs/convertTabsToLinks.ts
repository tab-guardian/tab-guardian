import type { Link } from '@/types'
import getImageURL from '@common/modules/getImageURL'

export default (tabs: chrome.tabs.Tab[]): Link[] => {
    const links: Link[] = []

    for (const tab of tabs) {
        if (!tab.url) {
            continue
        }

        links.push({
            id: tab.id || Date.now(),
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
]

function getFaviconIconUrl(tab: chrome.tabs.Tab): string {
    if (tab.url) {
        for (const [prefix, icon] of icons) {
            if (tab.url.startsWith(prefix)) {
                return getImageURL('images/' + icon)
            }
        }
    }

    return tab.favIconUrl || getImageURL('images/no-image.png')
}
