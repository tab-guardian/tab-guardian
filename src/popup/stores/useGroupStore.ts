import type { Group, SaveGroupParams } from '@/types'
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import getDefaultGroupTitle from '@/modules/getDefaultGroupTitle'
import getFromStorage from '@/modules/getFromStorage'
import saveToStorage from '@/modules/saveToStorage'
import getCurrentLinks from '@/modules/getCurrentLinks'

export const useGroupStore = defineStore('groupStore', () => {
    const groups = ref<Group[]>([])
    const isSaving = ref<boolean>(false)

    onMounted(() => restoreGroupsFromStorage())

    function restoreGroupsFromStorage(): void {
        getFromStorage<Group[]>('groups', storedGroups => {
            groups.value = storedGroups || []
        })
    }

    async function saveGroup(params: SaveGroupParams): Promise<void> {
        if (isSaving.value) {
            return
        }

        isSaving.value = true

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

        await saveToStorage('groups', groups.value)

        setTimeout(() => (isSaving.value = false), 500)
    }

    return {
        groups,
        isSaving,
        saveGroup,
    }
})
