import type { Link } from '@common/types'
import { queryTabs } from '@common/modules/tabs/queryTabs'
import { runtime } from '@common/modules/runtime'
import { config } from '@common/config'
import { isForbiddenUrl } from '@common/modules/url'

export async function restoreTabs(links: Link[]): Promise<Link[]> {
    const failedLinks: Link[] = []

    for (const link of links) {
        if (isForbiddenUrl(link.url)) {
            failedLinks.push(link)
            continue
        }

        try {
            await runtime.tabs.create({
                url: link.url,
                active: false,
                pinned: link.isPinned,
            })
        } catch {
            failedLinks.push(link)
        }
    }

    await closeEmptyTab()

    return failedLinks
}

async function closeEmptyTab(): Promise<void> {
    const tabs = await queryTabs({
        url: config.NEW_TAB_URLS,
        currentWindow: true,
        active: true,
    })

    for (const tab of tabs) {
        if (!tab.id) {
            continue
        }

        await runtime.tabs.remove(tab.id)
    }
}
