import type { Group } from '@common/types'
import { trans } from '@common/modules/utils'
import { showToast } from '@common/modules/toast'
import { savePasswordToStorage } from '@common/modules/storage/password'
import { isWrongPassError, getDecryptionError } from '@/errors'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import { useTabsStore } from '@/stores/tabs'
import { useCryptoStore } from '@/stores/crypto'
import { useSettingsStore } from '@/stores/settings'

export function useGroupUnlock() {
    const route = useRoute()
    const router = useRouter()
    const cryptoStore = useCryptoStore()
    const groupStore = useGroupStore()
    const tabsStore = useTabsStore()
    const settingsStore = useSettingsStore()

    async function unlockGroup(group: Group, password: string): Promise<boolean> {
        try {
            const decryptedGroup = await cryptoStore.decryptGroup(group, password)
            await groupStore.saveGroup(decryptedGroup)
        } catch (err: any) {
            handleUnlockGroupError(err)
            return false
        }

        if (settingsStore.settings.rememberPasswordAfterUnlock) {
            await savePasswordToStorage(group.id, password)
        }

        if (route.params.openTabs === 'true') {
            await tabsStore.openTabs(group, password)
            await router.push({ name: 'main' })
        } else {
            showToast(trans('group_unlocked'))
        }

        await router.push({ name: 'group', params: { id: group.id } })

        return true
    }

    function handleUnlockGroupError(err: any): void {
        if (!isWrongPassError(err)) {
            showToast(getDecryptionError(err), 'error')
            return
        }

        showToast(getDecryptionError(err), 'error')
    }

    return { unlockGroup }
}
