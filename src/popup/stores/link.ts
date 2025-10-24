import type { LinkBuffer } from '@common/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger, trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { cloneDeep } from 'lodash'

export const useLinkStore = defineStore('link', () => {
    const groupStore = useGroupStore()
    const popupStore = usePopupStore()

    const buffer = ref<LinkBuffer | null>(null)
    const isEmptyBuffer = computed<boolean>(() => buffer.value === null)

    async function copyLink(buf: LinkBuffer): Promise<void> {
        buffer.value = buf
    }

    function isLinkCut(linkId: number): boolean {
        if (!buffer.value || buffer.value.action !== 'cut') {
            return false
        }

        return buffer.value.link.id === linkId
    }

    async function pasteLink(groupId: number): Promise<void> {
        if (!buffer.value) {
            logger().warn(`There is nothing to paste for group ${groupId}`)
            return
        }

        const link = cloneDeep(buffer.value.link)
        link.id = Date.now()

        await groupStore.insertLinksInto(groupId, [link])

        if (buffer.value.action === 'cut') {
            await groupStore.deleteLinkFrom(
                buffer.value.groupId,
                buffer.value.link.id,
            )
        }

        buffer.value = null

        showToast({ text: trans('tab_pasted') })

        popupStore.hideAll()
    }

    return {
        isEmptyBuffer,
        copyLink,
        isLinkCut,
        pasteLink,
    }
})
