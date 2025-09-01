import { Link } from '@/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type LinkBuffer = {
    action: 'copy' | 'cut',
    groupId: number
    link: Link
}

export const useAppStore = defineStore('app', () => {
    const linkBuffer = ref<LinkBuffer | null>(null)
    const bufferIsEmpty = computed<boolean>(() => linkBuffer.value === null)

    function pasteLink(): void {
        // TODO: implement
        // 1. add link to the current group
    }

    return {
        linkBuffer,
        bufferIsEmpty,
        pasteLink,
    }
})
