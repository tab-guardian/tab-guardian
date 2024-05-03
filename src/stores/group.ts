import type { Group } from '@/types'
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import getDefaultGroupTitle from '@/modules/getDefaultGroupTitle'

export const useGroupStore = defineStore('group', () => {
    const groups = ref<Group[]>([])

    onMounted(() => getGroupsFromStorage())

    function getGroupsFromStorage(): Group[] {
        // @todo: get groups from the browser storage
        return []
    }

    function addGroup(title?: string): void {
        title = title || getDefaultGroupTitle()

        groups.value.push({
            id: Date.now(),
            title,
            links: [],
        })

        // @todo: save groups to the browser storage
    }

    return {
        groups,
        addGroup,
    }
})
