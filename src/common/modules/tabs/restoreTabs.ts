import type { Link } from '@common/types'
import { queryTabs } from '@common/modules/tabs/queryTabs'
import { runtime } from '@common/modules/runtime'
import { isRuntime } from '@common/modules/runtime/utils'
import { config } from '@common/config'

export async function restoreTabs(links: Link[]): Promise<void> {
    const isFirefox = isRuntime('firefox')

    for (const link of links) {
        // It's a limitation of Firefox, you cannot open about: pages.
        // Exclude opening links that start from `about:` keyword.
        // The only exception is `about:blank` which can be open.
        if (
            isFirefox &&
            link.url !== 'about:blank' &&
            link.url.startsWith('about:')
        ) {
            console.info(
                `Can't open ${link.url}. Firefox doesn't allow to open links that start with 'about:' keyword`,
            )
            continue
        }

        await runtime.tabs.create({
            url: link.url,
            active: false,
            pinned: link.isPinned,
        })
    }

    await closeEmptyTab()
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
