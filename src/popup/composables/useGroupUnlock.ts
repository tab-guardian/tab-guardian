import type { Group } from '@common/types'
import { trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import { savePasswordToStorage } from '@common/modules/storage/password'
import { isWrongPassError, getDecryptionError } from '@/errors'
import { useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import { useTabsStore } from '@/stores/tabs'
import { useCryptoStore } from '@/stores/crypto'
import { useSettingsStore } from '@/stores/settings'

export function useGroupUnlock() {
    const router = useRouter()
    const cryptoStore = useCryptoStore()
    const groupStore = useGroupStore()
    const tabsStore = useTabsStore()
    const settingsStore = useSettingsStore()

    async function unlockGroup(
        group: Group,
        password: string,
        openTabs: boolean = false,
    ): Promise<boolean> {
        try {
            const decryptedGroup = await cryptoStore.decryptGroup(group, password)
            await groupStore.save(decryptedGroup)
        } catch (err: any) {
            handleUnlockGroupError(err)
            return false
        }

        if (settingsStore.settings.rememberPasswordAfterUnlock) {
            await savePasswordToStorage(group.id, password)
        }

        if (openTabs) {
            await tabsStore.openTabs(group, password)
            await router.push({ name: 'main' })
            return true
        }

        showToast({ text: trans('group_unlocked') })

        await router.push({ name: 'group', params: { id: group.id } })

        return true
    }

    function handleUnlockGroupError(err: any): void {
        if (!isWrongPassError(err)) {
            showToast({ text: getDecryptionError(err), type: 'error' })
            return
        }

        showToast({ text: getDecryptionError(err), type: 'error' })
    }

    return { unlockGroup }
}
