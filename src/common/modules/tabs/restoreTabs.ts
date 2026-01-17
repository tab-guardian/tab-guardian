import type { Link } from '@common/types'
import { queryTabs } from '@common/modules/tabs/queryTabs'
import { runtime } from '@common/modules/runtime'
import { trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import { config } from '@common/config'
import { isForbiddenUrl } from '@common/modules/url'

export async function restoreTabs(links: Link[]): Promise<void> {
    for (const link of links) {
        if (isForbiddenUrl(link.url)) {
            showToast({
                text: trans('browser_cannot_open_tab', link.url),
                type: 'error',
            })
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
