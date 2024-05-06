import type { Group } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGroupModal = defineStore('groupModal', () => {
    const selectedGroup = ref<Group | null>(null)

    function reset(): void {
        selectedGroup.value = null
    }

    function select(group: Group): void {
        selectedGroup.value = group
    }

    return {
        selectedGroup,
        reset,
        select,
    }
})
