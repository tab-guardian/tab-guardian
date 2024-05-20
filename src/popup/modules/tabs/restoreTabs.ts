import type { Link } from '@/types'

export default async (links: Link[]): Promise<void> => {
    const currWindow = await chrome.windows.getCurrent()

    links.forEach(link => {
        chrome.tabs.create({
            url: link.url,
            active: false,
            pinned: link.isPinned,
        })
    })

    if (!currWindow.id) {
        return
    }

    // we need to update the window to focus it because after
    // creating tabs, the window changes focus to the other window
    chrome.windows.update(currWindow.id, { focused: true })
}