import { ref } from 'vue'
import { defineStore } from 'pinia'
import { unlockedGroupsStorage } from '@common/modules/storage/unlockedGroups'
import { groupStorage } from '@common/modules/storage/group'
import { renderWarningBadge, clearWarningBadge } from '@common/modules/badge'
import { trans } from '@common/modules'

export const useNotificationStore = defineStore('notification', () => {
    const notification = ref<string | null>(null)

    async function recalculateNotification(): Promise<void> {
        const unlockedCount = await groupStorage.countUnlocked()

        if (unlockedCount === 0) {
            notification.value = null
            await unlockedGroupsStorage.delete()
            await clearWarningBadge()
            return
        }

        await renderWarningBadge()
        await unlockedGroupsStorage.set()

        notification.value = trans(
            'you_have_unlocked_groups',
            unlockedCount.toString(),
        )
    }

    return {
        notification,
        recalculateNotification,
    }
})
