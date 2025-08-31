import { Link } from '@/types'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type LinkBuffer = {
    groupId: number
    link: Link
}

export const useAppStore = defineStore('app', () => {
    const linkBuffer = ref<LinkBuffer | null>(null)
    const canCopy = computed<boolean>(() => linkBuffer.value === null)

    return {
        linkBuffer,
        canCopy,
    }
})
