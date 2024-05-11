import type { Group } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGroupModalStore = defineStore('groupModalStore', () => {
    const selectedGroup = ref<Group | null>(null)
    const newTitleField = ref<string>('')
    const isTitleFieldActive = ref<boolean>(false)

    function reset(): void {
        selectedGroup.value = null
        newTitleField.value = ''
    }

    function select(group: Group): void {
        selectedGroup.value = group
        newTitleField.value = group.title
    }

    return {
        selectedGroup,
        isTitleFieldActive,
        newTitleField,
        reset,
        select,
    }
})
