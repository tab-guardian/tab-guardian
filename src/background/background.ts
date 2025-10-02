import { targetBrowser } from '@common/modules/browser/targetBrowser'
import { hasUnlockedGroupsFlag } from '@common/modules/storage/unlockedGroups'
import { renderWarningBadge } from '@common/modules/badge'

const target = targetBrowser()

target.runtime.onInstalled.addListener(async () => await renderWarningBadgeIfNeeded())
target.runtime.onStartup.addListener(async () => await renderWarningBadgeIfNeeded())

async function renderWarningBadgeIfNeeded(): Promise<void> {
    const hasUnlocked = await hasUnlockedGroupsFlag()

    if (hasUnlocked) {
        await renderWarningBadge()
    }
}

target.runtime.onMessage.addListener(request => {
    if (request.type === 'closeTabs') {
        closeTabs(request.payload)
    }
})

async function closeTabs(ids: number[]): Promise<void> {
    // create a new tab to prevent closing the browser
    await target.tabs.create({})

    for (const id of ids) {
        await target.tabs.remove(id)
    }
}
