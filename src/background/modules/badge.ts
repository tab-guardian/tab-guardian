import { unlockedGroupsStorage } from '@common/modules/storage/unlockedGroups'
import { renderWarningBadge } from '@common/modules/badge'

export async function renderWarningBadgeIfNeeded(): Promise<void> {
    const hasUnlocked = await unlockedGroupsStorage.has()

    if (hasUnlocked) {
        await renderWarningBadge()
    }
}
