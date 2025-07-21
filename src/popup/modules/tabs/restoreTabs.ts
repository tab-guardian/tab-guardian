import type { Link } from '@/types'
import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'
import { queryTabs } from '@/modules/tabs/queryTabs'

export async function restoreTabs(links: Link[]): Promise<void> {
    if (isDevelopment()) {
        links.forEach(link => {
            window.open(link.url, '_blank')
        })

        return
    }

    links.forEach(link => {
        targetBrowser().tabs.create({
            url: link.url,
            active: false,
            pinned: link.isPinned,
        })
    })

    await closeEmptyTab()
}

async function closeEmptyTab(): Promise<void> {
    const tabs = await queryTabs({
        url: 'chrome://newtab/',
        currentWindow: true,
        active: true,
    })

    if (tabs.length === 0 || !tabs[0].id) {
        return
    }

    await targetBrowser().tabs.remove(tabs[0].id)
}
