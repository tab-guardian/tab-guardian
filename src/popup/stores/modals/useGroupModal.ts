import type { Group } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGroupModal = defineStore('groupModal', () => {
    const selectedGroup = ref<Group | null>(null)
    const askToDelete = ref<boolean>(false)

    function reset(): void {
        selectedGroup.value = null
    }

    function select(group: Group): void {
        selectedGroup.value = group
    }

    function deleteGroup(): void {
        //
    }

    return {
        selectedGroup,
        askToDelete,
        reset,
        select,
        deleteGroup,
    }
})
