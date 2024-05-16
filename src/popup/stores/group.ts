import type { Group, Link } from '@/types'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useTransStore } from '@/stores/trans'
import showToast from '@common/modules/showToast'
import getFromStorage from '@common/modules/storage/getFromStorage'
import error from '@common/modules/error'
import getDefaultGroupName from '@/modules/getDefaultGroupName'
import unlock from '@common/modules/encrypt/decryptGroup'
import saveToStorage from '@common/modules/storage/saveToStorage'
import encryptGroup from '@common/modules/encrypt/encryptGroup'

export const useGroupStore = defineStore('group', () => {
    const groups = ref<Group[]>([])
    const isSaving = ref<boolean>(false)
    const selectedGroup = ref<Group | null>(null)
    const isTitleFieldActive = ref<boolean>(false)

    const router = useRouter()
    const settingsStore = useSettingsStore()
    const { trans } = useTransStore()

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

    function encryptGroupById(groupId: number): boolean {
        const group = groups.value.find(group => group.id === groupId)

        if (!group) {
            showToast(trans('Group has not been found'), 'error')
            error.err(`Group with id ${groupId} not found`)
            return false
        }

        if (group.isEncrypted) {
            showToast(trans('Group is already locked'), 'error')
            error.warn('Group is already locked')
            return false
        }

        if (settingsStore.settings.password === '') {
            const msg = trans(
                'Password is empty. Make sure to set a password in the settings',
            )

            showToast(msg, 'error')
            return false
        }

        try {
            groups.value = groups.value.map(g => {
                if (g.id !== groupId) {
                    return g
                }

                const pwd = settingsStore.settings.password
                const encrypted = encryptGroup(g, pwd)
                encrypted.isEncrypted = true

                return encrypted
            })
        } catch (err) {
            showToast(trans('Error ocurred'), 'error')
            error.err(err)
        }

        saveGroups()

        return true
    }

    function createEmptyGroup(): Group {
        const group = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: newGroup.value.name,
            isPrivate: newGroup.value.isPrivate,
            isEncrypted: false,
            links: [],
        }

        groups.value.unshift(group)

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
            showToast(trans('Error ocurred'), 'error')
            return
        }

        const id = selectedGroup.value.id
        const group = groups.value.find(group => group.id === id)

        if (!group) {
            error.err(`Group with id ${id} not found`)
            showToast(trans('Error ocurred'), 'error')
            return
        }

        if (newGroup.value.name === '') {
            group.name = getDefaultGroupName(newGroup.value.isPrivate)
        } else {
            group.name = newGroup.value.name
        }

        isTitleFieldActive.value = false

        saveGroups()
        showToast(trans('The new name has been saved'))
    }

    function deleteGroup(id: number): void {
        groups.value = groups.value.filter(group => group.id !== id)
        saveGroups()
        router.push({ name: 'main' })
    }

    function deleteAllLinks(groupId: number): void {
        groups.value = groups.value.map(group => {
            if (group.id === groupId) {
                group.links = []
            }

            return group
        })

        saveGroups()
    }

    function deleteLink(groupId: number, linkId: number): void {
        const group = groups.value.find(group => group.id === groupId)

        if (!group) {
            return
        }

        group.links = group.links.filter(link => link.id !== linkId)

        saveGroups()
    }

    function prependLinksTo(groupId: number, links: Link[]): void {
        groups.value = groups.value.map(group => {
            if (group.id === groupId) {
                group.links.unshift(...links)
            }

            return group
        })

        saveGroups()
    }

    function decryptGroup(group: Group, pass: string): void {
        groups.value = groups.value.map(g => {
            if (g.id === group.id) {
                return unlock(group, pass)
            }

            return g
        })

        saveGroups()
    }

    function resetNewGroup(): void {
        newGroup.value.name = ''
        newGroup.value.isPrivate = false
    }

    function saveGroups(): void {
        saveToStorage('groups', groups.value)
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
        decryptGroup,
        renameGroup,
        createEmptyGroup,
        encryptGroupById,
        getGroupById,
        deleteAllLinks,
    }
})
