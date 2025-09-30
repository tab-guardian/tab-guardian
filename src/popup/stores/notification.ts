import { ref } from 'vue'
import { defineStore } from 'pinia'
import { countUnlockedGroups, deleteHasUnlockedGroupsFlag, setHasUnlockedGroupsFlag } from '@common/modules/storage/unlockedGroups'
import { renderWarningBadge, clearWarningBadge } from '@common/modules/badge'
import { trans } from '@common/modules/trans'

export const useNotificationStore = defineStore('notification', () => {
    const notification = ref<string | null>(null)

    async function recalculateNotification(): Promise<void> {
        const unlockedCount = await countUnlockedGroups()

        if (unlockedCount === 0) {
            notification.value = null
            await deleteHasUnlockedGroupsFlag()
            await clearWarningBadge()
            return
        }

        await renderWarningBadge()
        await setHasUnlockedGroupsFlag()

        notification.value = trans('you_have_unlocked_groups', unlockedCount.toString())
    }

    return {
        notification,
        recalculateNotification,
    }
})
