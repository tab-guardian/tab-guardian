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
        groups.value.push({
            id: Date.now(),
            title: params.title || getDefaultGroupTitle(),
            links: [],
            isPrivate: params.isPrivate || false,
        })

        saveToStorage('groups', groups.value)
    }

    return {
        groups,
        saveGroup,
    }
})
