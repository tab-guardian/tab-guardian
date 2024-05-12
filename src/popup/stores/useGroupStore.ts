import type { Group, SaveGroupParams, Link } from '@/types'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import getFromStorage from '@/modules/getFromStorage'
import saveToStorage from '@/modules/saveToStorage'
import error from '@/modules/error'
import getDefaultGroupName from '@/modules/getDefaultGroupName'

export const useGroupStore = defineStore('groupStore', () => {
    const groups = ref<Group[]>([])
    const isSaving = ref<boolean>(false)
    const selectedGroup = ref<Group | null>(null)
    const isTitleFieldActive = ref<boolean>(false)
    const router = useRouter()

    const newGroup = ref({
        name: '',
        isPrivate: false,
    })

    onMounted(() => loadGroupsFromStorage())

    function getGroupById(id: number): Group | null {
        return groups.value.find(g => g.id === id) || null
    }

    function loadGroupsFromStorage(): void {
        getFromStorage<Group[] | null>('groups', storedGroups => {
            groups.value = storedGroups || []
        })
    }

    async function createEmptyGroup(): Promise<Group> {
        const group = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: newGroup.value.name,
            isPrivate: newGroup.value.isPrivate,
            isEncrypted: false,
            links: [],
        }

        groups.value.unshift(group)

        await saveGroupsToStorage()

        return group
    }

    function goBack(): void {
        selectedGroup.value = null
        resetNewGroup()
        router.go(-1)
    }

    function select(group: Group): void {
        selectedGroup.value = group
        newGroup.value.name = group.name
        newGroup.value.isPrivate = group.isPrivate
        router.push({ name: 'group', params: { id: group.id } })
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

        if (newGroup.value.name === '') {
            group.name = getDefaultGroupName(newGroup.value.isPrivate)
        } else {
            group.name = newGroup.value.name
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

    function resetNewGroup(): void {
        newGroup.value.name = ''
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
        deleteGroup,
        deleteLink,
        prependLinksTo,
        renameGroup,
        createEmptyGroup,
        getGroupById,
    }
})
