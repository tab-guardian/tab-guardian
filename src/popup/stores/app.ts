import { Link } from '@/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { trans } from '@common/modules/trans'
import { error } from '@common/modules/error'
import { showToast } from '@common/modules/showToast'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'

type LinkBuffer = {
    action: 'copy' | 'cut',
    groupId: number
    link: Link
}

export const useAppStore = defineStore('app', () => {
    const linkBuffer = ref<LinkBuffer | null>(null)
    const bufferIsEmpty = computed<boolean>(() => linkBuffer.value === null)

    const { prependLinksTo, deleteLink } = useGroupStore()
    const { closeAllPopups } = usePopupStore()

    function linkIsCut(linkId: number): boolean {
        if (!linkBuffer.value || linkBuffer.value.action !== 'cut') {
            return false
        }

        return linkBuffer.value.link.id === linkId
    }

    async function pasteLink(groupId: number): Promise<void> {
        if (!linkBuffer.value) {
            error.warn(`There is nothing to paste for group ${groupId}`)
            return
        }

        const link = Object.assign({}, linkBuffer.value.link)
        link.id = Date.now()

        await prependLinksTo(groupId, [link])

        if (linkBuffer.value.action === 'cut') {
            await deleteLink(
                linkBuffer.value.groupId,
                linkBuffer.value.link.id,
            )
        }

        linkBuffer.value = null

        showToast(trans('tab_pasted'))
        closeAllPopups()
    }

    return {
        linkBuffer,
        bufferIsEmpty,
        linkIsCut,
        pasteLink,
    }
})
