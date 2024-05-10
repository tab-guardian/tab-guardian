import type { Group, SaveGroupParams, Link } from '@/types'
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

    function deleteGroup(id: number): void {
        groups.value = groups.value.filter(group => group.id !== id)
        saveGroupsToStorage()
    }

    function deleteLink(groupId: number, linkId: number): void {
        const group = groups.value.find(group => group.id === groupId)

        if (!group) {
            return
        }

        group.links = group.links.filter(link => link.id !== linkId)

        saveGroupsToStorage()
    }

    function prependLinksTo(groupId: number, links: Link[]): void {
        const group = groups.value.find(group => group.id === groupId)

        if (!group) {
            return
        }

        group.links.unshift(...links)

        saveGroupsToStorage()
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

        await saveGroupsToStorage()
    }

    async function saveGroupsToStorage(): Promise<void> {
        await saveToStorage('groups', groups.value)
        setTimeout(() => (isSaving.value = false), 500)
    }

    return {
        groups,
        isSaving,
        saveGroup,
        deleteGroup,
        deleteLink,
        prependLinksTo,
    }
})
