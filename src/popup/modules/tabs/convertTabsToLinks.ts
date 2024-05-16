import type { Link } from '@/types'
import getImageUrl from '@common/modules/getImageUrl'

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
            favIconUrl: tab.favIconUrl || getImageUrl('no-image.png'),
        })
    }

    return links
}
