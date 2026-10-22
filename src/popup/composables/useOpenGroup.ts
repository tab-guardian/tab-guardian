import type { Group, ToastMessage } from '@common/types'
import type { PasswordAttemptResult } from '@common/types/modal'
import { useRouter } from 'vue-router'
import { trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { useModalStore } from '@/stores/modal'
import { useTabsStore } from '@/stores/tabs'

export function useOpenGroup() {
    const router = useRouter()
    const groupStore = useGroupStore()
    const modalStore = useModalStore()
    const tabsStore = useTabsStore()

    async function open(group: Group): Promise<ToastMessage[]> {
        if (group.links.length === 0) {
            return []
        }

        if (!group.isPrivate || !group.isEncrypted) {
            const result = await tabsStore.openTabs(group)

            return result.toastMsgs
        }

        let toastMsgs: ToastMessage[] = []

        // A locked group needs its password first. Unlocking already
        // decrypted groups would fail, so they are handled above.
        await modalStore.show('password', {
            text: trans('enter_pass_unlock_content'),
            decrypting: unlockGroup,
        })

        return toastMsgs

        async function unlockGroup(pass: string): Promise<PasswordAttemptResult> {
            const unlocking = await groupStore.unlock(group, pass)

            const toastMsg: ToastMessage = {
                text: unlocking.message,
                type: unlocking.failed ? 'error' : 'info',
            }

            if (unlocking.failed) {
                return { success: false, toastMsg }
            }

            const result = await tabsStore.openTabs(unlocking.group, pass)

            toastMsgs = result.toastMsgs

            await router.push({ name: 'main' })

            return { success: true, toastMsg }
        }
    }

    return { open }
}
