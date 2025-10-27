import type { LinkBuffer } from '@common/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { cloneDeep } from 'lodash'

export const useLinkStore = defineStore('link', () => {
    const groupStore = useGroupStore()

    const buffer = ref<LinkBuffer | null>(null)
    const isEmptyBuffer = computed<boolean>(() => buffer.value === null)

    async function copyLink(buf: LinkBuffer): Promise<void> {
        const groupExist = groupStore.exist(buf.initialGroupId)

        if (!groupExist) {
            const msg =
                'Cannot create link buffer. ' +
                `Group with id "${buf.initialGroupId}" does not exist`

            throw new Error(msg)
        }

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

        if (buffer.value.action === 'copy') {
            link.id = Date.now()
        }

        await groupStore.insertLinksInto(groupId, [link])

        if (buffer.value.action === 'cut') {
            await groupStore.deleteLinkFrom(
                buffer.value.initialGroupId,
                buffer.value.link.id,
            )
        }

        buffer.value = null
    }

    return {
        isEmptyBuffer,
        copyLink,
        isLinkCut,
        pasteLink,
    }
})
