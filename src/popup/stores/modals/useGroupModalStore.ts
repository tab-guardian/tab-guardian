import type { Group } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGroupModalStore = defineStore('groupModalStore', () => {
    const selectedGroup = ref<Group | null>(null)
    const askToDelete = ref<boolean>(false)

    function reset(): void {
        selectedGroup.value = null
    }

    function select(group: Group): void {
        selectedGroup.value = group
    }

    return {
        selectedGroup,
        askToDelete,
        reset,
        select,
    }
})
