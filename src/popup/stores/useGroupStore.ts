import type { Group, SaveGroupParams } from '@/types'
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import getDefaultGroupTitle from '@/modules/getDefaultGroupTitle'
import getFromStorage from '@/modules/getFromStorage'
import saveToStorage from '@/modules/saveToStorage'
import getCurrentLinks from '@/modules/getCurrentLinks'

export const useGroupStore = defineStore('groupStore', () => {
    const groups = ref<Group[]>([])

    onMounted(() => restoreGroupsFromStorage())

    function restoreGroupsFromStorage(): void {
        getFromStorage<Group[]>('groups', storedGroups => {
            groups.value = storedGroups || []
        })
    }

    async function saveGroup(params: SaveGroupParams): Promise<void> {
        const isPrivate = params.isPrivate || false

        const links = await getCurrentLinks({
            closeTabs: false,
        })

        groups.value.unshift({
            id: Date.now(),
            title: params.title || getDefaultGroupTitle(isPrivate),
            links,
            isPrivate,
        })

        saveToStorage('groups', groups.value)
    }

    return {
        groups,
        saveGroup,
    }
})
