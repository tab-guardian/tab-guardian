import { ref } from 'vue'
import { defineStore } from 'pinia'
import { unlcokedGroupsStorage } from '@common/modules/storage/unlockedGroups'
import { renderWarningBadge, clearWarningBadge } from '@common/modules/badge'
import { trans } from '@common/modules'

export const useNotificationStore = defineStore('notification', () => {
    const notification = ref<string | null>(null)

    async function recalculateNotification(): Promise<void> {
        const unlockedCount = await unlcokedGroupsStorage.count()

        if (unlockedCount === 0) {
            notification.value = null
            await unlcokedGroupsStorage.delete()
            await clearWarningBadge()
            return
        }

        await renderWarningBadge()
        await unlcokedGroupsStorage.set()

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
