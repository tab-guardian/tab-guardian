import type { Group, SaveGroupParams } from '@/types'
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import getDefaultGroupTitle from '@/modules/getDefaultGroupTitle'
import getFromStorage from '@/modules/getFromStorage'
import saveToStorage from '@/modules/saveToStorage'

export const useGroupStore = defineStore('groupStore', () => {
    const groups = ref<Group[]>([])

    onMounted(() => restoreGroupsFromStorage())

    function restoreGroupsFromStorage(): void {
        getFromStorage<Group[]>('groups', storedGroups => {
            groups.value = storedGroups || []
        })
    }

    function saveGroup(params: SaveGroupParams): void {
        const isPrivate = params.isPrivate || false

        groups.value.unshift({
            id: Date.now(),
            title: params.title || getDefaultGroupTitle(isPrivate),
            links: [],
            isPrivate,
        })

        saveToStorage('groups', groups.value)
    }

    return {
        groups,
        saveGroup,
    }
})
