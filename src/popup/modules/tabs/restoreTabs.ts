import type { Link } from '@/types'

export default (links: Link[]): void => {
    links.forEach(link => {
        chrome.tabs.create({
            url: link.url,
            active: false,
            pinned: link.isPinned,
        })
    })
}