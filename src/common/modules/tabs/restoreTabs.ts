import type { Link } from '@common/types'
import { queryTabs } from '@common/modules/tabs/queryTabs'
import { runtime } from '@common/modules/runtime'
import { isRuntime } from '@common/modules/runtime/utils'
import { config } from '@common/config'
import { showToast } from '@common/modules/toast'
import { trans } from '@common/modules'

export async function restoreTabs(links: Link[]): Promise<void> {
    for (const link of links) {
        if (shouldPreventOpening(link.url)) {
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

function shouldPreventOpening(url: string): boolean {
    const isFirefox = isRuntime('firefox')

    if (!isFirefox || url === 'about:blank') {
        return false
    }

    // It's a limitation of Firefox, you cannot open about: and chrome: pages.
    // The only exception is `about:blank` which can be open.
    if (url.startsWith('about:') || url.startsWith('chrome:')) {
        showToast({
            text: trans('browser_cannot_open_tab', url),
            type: 'error',
        })
        return true
    }

    return false
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
