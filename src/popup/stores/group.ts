import type { Group, Link } from '@/types'
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useTransStore } from '@/stores/trans'
import showToast from '@common/modules/showToast'
import getGroupsFromStorage from '@common/modules/storage/getGroupsFromStorage'
import error from '@common/modules/error'
import getDefaultGroupName from '@/modules/getDefaultGroupName'
import unlock from '@common/modules/encrypt/decryptGroup'
import saveGroupsToStorage from '@common/modules/storage/saveGroupsToStorage'
import encryptGroup from '@common/modules/encrypt/encryptGroup'
import closeTabsByIds from '@/modules/tabs/closeTabsByIds'

export const useGroupStore = defineStore('group', () => {
    const groups = ref<Group[]>([])
    const isSaving = ref<boolean>(false)
    const selectedGroup = ref<Group | null>(null)
    const isTitleFieldActive = ref<boolean>(false)
    const closeSelectedTabs = ref<boolean>(false)

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

    async function loadGroupsFromStorage(): Promise<void> {
        groups.value = await getGroupsFromStorage()
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
                encrypted.isPrivate = true

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
            name: newGroup.value.name || getDefaultGroupName(newGroup.value.isPrivate),
            isPrivate: newGroup.value.isPrivate,
            isEncrypted: false,
            links: [],
        }

        groups.value.unshift(group)

        return group
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
    }

    function deleteAllGroups(): void {
        groups.value = []
        saveGroups()
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

        if (closeSelectedTabs.value) {
            closeTabsByIds(links.map(link => link.id))
        }

        saveGroups(() => resetNewGroup())
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

    async function saveGroups(callback?: () => void): Promise<void> {
        await saveGroupsToStorage(groups.value)

        setTimeout(() => {
            isSaving.value = false
            callback ? callback() : null
        }, 500)
    }

    return {
        groups,
        isSaving,
        selectedGroup,
        isTitleFieldActive,
        closeSelectedTabs,
        newGroup,
        deleteGroup,
        deleteLink,
        prependLinksTo,
        decryptGroup,
        renameGroup,
        createEmptyGroup,
        encryptGroupById,
        getGroupById,
        deleteAllLinks,
        deleteAllGroups,
    }
})
