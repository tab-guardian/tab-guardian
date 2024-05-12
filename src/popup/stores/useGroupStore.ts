import type { Group, SaveGroupParams, Link } from '@/types'
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useModalStore } from '@/stores/useModalStore'
import getFromStorage from '@/modules/getFromStorage'
import saveToStorage from '@/modules/saveToStorage'
import error from '@/modules/error'
import getDefaultGroupTitle from '@/modules/getDefaultGroupTitle'

export const useGroupStore = defineStore('groupStore', () => {
    const groups = ref<Group[]>([])
    const isSaving = ref<boolean>(false)
    const selectedGroup = ref<Group | null>(null)
    const isTitleFieldActive = ref<boolean>(false)

    const newGroup = ref({
        title: '',
        isPrivate: false,
    })

    const { openModal, closeModal } = useModalStore()

    onMounted(() => restoreGroupsFromStorage())

    function getGroupById(id: number): Group | null {
        return groups.value.find(g => g.id === id) || null
    }

    function restoreGroupsFromStorage(): void {
        getFromStorage<Group[] | null>('groups', storedGroups => {
            groups.value = storedGroups || []
        })
    }

    async function createEmptyGroup(): Promise<Group> {
        const group = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            title: newGroup.value.title,
            isPrivate: newGroup.value.isPrivate,
            links: [],
        }

        groups.value.unshift(group)

        await saveGroupsToStorage()

        return group
    }

    function goBack(): void {
        selectedGroup.value = null
        resetNewGroup()
        closeModal('group')
    }

    function select(group: Group): void {
        selectedGroup.value = group
        newGroup.value.title = group.title
        newGroup.value.isPrivate = group.isPrivate
        openModal('group')
    }

    function renameGroup(): void {
        if (!selectedGroup.value) {
            error.err('No group selected for renaming')
            return
        }

        const id = selectedGroup.value.id
        const group = groups.value.find(group => group.id === id)

        if (!group) {
            error.err(`Group with id ${id} not found`)
            return
        }

        if (newGroup.value.title === '') {
            group.title = getDefaultGroupTitle(newGroup.value.isPrivate)
        } else {
            group.title = newGroup.value.title
        }

        isTitleFieldActive.value = false

        saveGroupsToStorage()
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

        groups.value.unshift({
            id: Date.now(),
            title: params.title,
            links: params.links,
            isPrivate,
        })

        resetNewGroup()

        await saveGroupsToStorage()
    }

    function resetNewGroup(): void {
        newGroup.value.title = ''
        newGroup.value.isPrivate = false
    }

    async function saveGroupsToStorage(): Promise<void> {
        await saveToStorage('groups', groups.value)
        setTimeout(() => (isSaving.value = false), 500)
    }

    return {
        groups,
        isSaving,
        selectedGroup,
        isTitleFieldActive,
        newGroup,
        goBack,
        select,
        saveGroup,
        deleteGroup,
        deleteLink,
        prependLinksTo,
        renameGroup,
        createEmptyGroup,
        getGroupById,
    }
})
