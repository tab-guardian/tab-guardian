import type { Group, SaveGroupParams, Link } from '@/types'
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useModalStore } from '@/stores/useModalStore'
import getFromStorage from '@/modules/getFromStorage'
import saveToStorage from '@/modules/saveToStorage'
import error from '@/modules/error'

export const useGroupStore = defineStore('groupStore', () => {
    const groups = ref<Group[]>([])
    const isSaving = ref<boolean>(false)
    const selectedGroup = ref<Group | null>(null)
    const newTitleField = ref<string>('')
    const isTitleFieldActive = ref<boolean>(false)
    const { openModal, closeModal } = useModalStore()

    onMounted(() => restoreGroupsFromStorage())

    function restoreGroupsFromStorage(): void {
        getFromStorage<Group[] | null>('groups', storedGroups => {
            groups.value = storedGroups || []
        })
    }

    function goBack(): void {
        selectedGroup.value = null
        newTitleField.value = ''
        closeModal('group')
    }

    function select(group: Group): void {
        selectedGroup.value = group
        newTitleField.value = group.title
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

        group.title = newTitleField.value
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

        await saveGroupsToStorage()
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
        newTitleField,
        goBack,
        select,
        saveGroup,
        deleteGroup,
        deleteLink,
        prependLinksTo,
        renameGroup,
    }
})
