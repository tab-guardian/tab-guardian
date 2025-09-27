import type { Link } from '@/types'
import { isDevelopment } from '@common/modules/isDevelopment'
import { targetBrowser } from '@common/modules/browser/targetBrowser'
import { queryTabs } from '@/modules/tabs/queryTabs'
import { isFirefox } from '@common/modules/browser/isFirefox'

export async function restoreTabs(links: Link[]): Promise<void> {
    if (isDevelopment()) {
        links.forEach(link => window.open(link.url, '_blank'))
        return
    }

    const isFire = isFirefox()

    for (const link of links) {
        // It's a limitation of Firefox, you cannot open about word.
        // Exclude opening links that start from `about:` keyword.
        // The only exception is `about:blank` which can be open.
        if (isFire && link.url !== 'about:blank' && link.url.startsWith('about:')) {
            console.info(`Can't open ${link.url}. Firefox doesn't allow to open links that start with 'about:' word`)
            continue
        }

        targetBrowser().tabs.create({
            url: link.url,
            active: false,
            pinned: link.isPinned,
        })
    }

    await closeEmptyTab()
}

async function closeEmptyTab(): Promise<void> {
    const tabs = await queryTabs({
        url: isFirefox() ? 'about:newtab' : 'chrome://newtab/',
        currentWindow: true,
        active: true,
    })

    for (const tab of tabs) {
        if (!tab.id) {
            continue
        }

        await targetBrowser().tabs.remove(tab.id)
    }
}
