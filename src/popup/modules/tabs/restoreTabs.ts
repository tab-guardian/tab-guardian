import type { Link } from '@/types'
import isDevelopment from '@common/modules/isDevelopment'

export default async (links: Link[]): Promise<void> => {
    if (isDevelopment()) {
        links.forEach(link => {
            window.open(link.url, '_blank')
        })

        return
    }

    links.forEach(link => {
        chrome.tabs.create({
            url: link.url,
            active: false,
            pinned: link.isPinned,
        })
    })
}