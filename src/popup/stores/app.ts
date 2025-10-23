import { Link } from '@common/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger, trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { cloneDeep } from 'lodash'

type LinkBuffer = {
    action: 'copy' | 'cut'
    groupId: number
    link: Link
}

export const useAppStore = defineStore('app', () => {
    const linkBuffer = ref<LinkBuffer | null>(null)
    const bufferIsEmpty = computed<boolean>(() => linkBuffer.value === null)

    const groupStore = useGroupStore()
    const popupStore = usePopupStore()

    function linkIsCut(linkId: number): boolean {
        if (!linkBuffer.value || linkBuffer.value.action !== 'cut') {
            return false
        }

        return linkBuffer.value.link.id === linkId
    }

    async function pasteLink(groupId: number): Promise<void> {
        if (!linkBuffer.value) {
            logger().warn(`There is nothing to paste for group ${groupId}`)
            return
        }

        const link = cloneDeep(linkBuffer.value.link)
        link.id = Date.now()

        await groupStore.insertLinksInto(groupId, [link])

        if (linkBuffer.value.action === 'cut') {
            await groupStore.deleteLinkFrom(
                linkBuffer.value.groupId,
                linkBuffer.value.link.id,
            )
        }

        linkBuffer.value = null

        showToast({ text: trans('tab_pasted') })

        popupStore.hideAll()
    }

    return {
        linkBuffer,
        bufferIsEmpty,
        linkIsCut,
        pasteLink,
    }
})
