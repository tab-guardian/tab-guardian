import { hasUnlockedGroupsFlag } from '@common/modules/storage/unlockedGroups'
import { renderWarningBadge } from '@common/modules/badge'
import { countAllTabs } from '@common/modules/tabs/countAllTabs'
import { runtime } from '@common/modules/runtime'
import { isRuntime } from '@common/modules/runtime/utils'

const target = isRuntime('firefox') ? browser : chrome

target.runtime.onInstalled.addListener(
    async () => await renderWarningBadgeIfNeeded(),
)
target.runtime.onStartup.addListener(async () => await renderWarningBadgeIfNeeded())

async function renderWarningBadgeIfNeeded(): Promise<void> {
    const hasUnlocked = await hasUnlockedGroupsFlag()

    if (hasUnlocked) {
        await renderWarningBadge()
    }
}

target.runtime.onMessage.addListener(async request => {
    if (request.type === 'closeTabs') {
        await closeTabs(request.payload)
    }
})

async function closeTabs(ids: number[]): Promise<void> {
    const allTabsCount = await countAllTabs()

    // create a new tab to prevent closing the browser
    if (allTabsCount === ids.length) {
        await runtime.tabs.create({})
    }

    for (const id of ids) {
        await runtime.tabs.remove(id)
    }
}
